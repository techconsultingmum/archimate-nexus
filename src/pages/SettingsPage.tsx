import { useState, useEffect, useCallback } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/components/theme-provider";
import { supabase } from "@/integrations/supabase/client";
import { passwordChangeSchema, parseFormData } from "@/lib/validation";
import {
  Settings,
  User,
  Bell,
  Shield,
  Palette,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Sun,
  Moon,
  Monitor,
  Check,
} from "lucide-react";

interface PasswordErrors {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

const SettingsPage = () => {
  const { profile, primaryRole } = useAuth();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [collapsedSidebar, setCollapsedSidebar] = useState(() => {
    return localStorage.getItem('sidebar-collapsed') === 'true';
  });
  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
  });
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    reviewAlerts: true,
    changeNotifications: false,
    weeklyDigest: true,
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState<PasswordErrors>({});
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const handleSidebarToggle = (checked: boolean) => {
    setCollapsedSidebar(checked);
    localStorage.setItem('sidebar-collapsed', String(checked));
  };

  // Sync profile data when it changes
  useEffect(() => {
    if (profile) {
      setProfileData({
        fullName: profile.full_name || "",
        email: profile.email || "",
      });
    }
  }, [profile]);

  const handleSaveProfile = async () => {
    if (!profileData.fullName.trim()) {
      toast({
        title: "Validation Error",
        description: "Name cannot be empty",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ full_name: profileData.fullName.trim() })
        .eq("id", profile?.id);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been saved successfully.",
      });
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Error",
        description: "Failed to save profile changes.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = useCallback(async () => {
    setPasswordErrors({});
    setPasswordSuccess(false);

    const validationResult = parseFormData(passwordChangeSchema, passwordData);

    if (!validationResult.success && 'errors' in validationResult) {
      setPasswordErrors(validationResult.errors as PasswordErrors);
      return;
    }

    setChangingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword,
      });

      if (error) throw error;

      setPasswordSuccess(true);
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      
      toast({
        title: "Password updated",
        description: "Your password has been changed successfully.",
      });
    } catch (error) {
      console.error("Error updating password:", error);
      setPasswordErrors({ 
        currentPassword: "Failed to update password. Please check your current password and try again." 
      });
    } finally {
      setChangingPassword(false);
    }
  }, [passwordData, toast]);

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Settings className="h-6 sm:h-8 w-6 sm:w-8 text-primary" />
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Settings</h1>
          </div>
          <p className="text-muted-foreground text-sm sm:text-base">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Settings Tabs */}
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid grid-cols-2 sm:grid-cols-4 w-full">
            <TabsTrigger value="profile" className="gap-2 text-xs sm:text-sm">
              <User className="h-4 w-4" />
              <span className="hidden xs:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2 text-xs sm:text-sm">
              <Bell className="h-4 w-4" />
              <span className="hidden xs:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="gap-2 text-xs sm:text-sm">
              <Palette className="h-4 w-4" />
              <span className="hidden xs:inline">Appearance</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2 text-xs sm:text-sm">
              <Shield className="h-4 w-4" />
              <span className="hidden xs:inline">Security</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal information and profile settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={profile?.avatar_url || undefined} />
                    <AvatarFallback className="text-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground">
                      {profile?.full_name?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline" size="sm">
                      Change Avatar
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">
                      JPG, PNG or GIF. Max size 2MB.
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={profileData.fullName}
                      onChange={(e) =>
                        setProfileData((prev) => ({ ...prev, fullName: e.target.value }))
                      }
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">
                      Email cannot be changed. Contact support if needed.
                    </p>
                  </div>

                  <div className="grid gap-2">
                    <Label>Role</Label>
                    <Input value={primaryRole.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())} disabled className="bg-muted" />
                    <p className="text-xs text-muted-foreground">
                      Roles are managed by Enterprise Architects.
                    </p>
                  </div>
                </div>

                <Button onClick={handleSaveProfile} disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Choose how you want to be notified about activity
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch
                    checked={notifications.emailNotifications}
                    onCheckedChange={(checked) =>
                      setNotifications((prev) => ({ ...prev, emailNotifications: checked }))
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Review Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when artifacts need your review
                    </p>
                  </div>
                  <Switch
                    checked={notifications.reviewAlerts}
                    onCheckedChange={(checked) =>
                      setNotifications((prev) => ({ ...prev, reviewAlerts: checked }))
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Change Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when artifacts you own are modified
                    </p>
                  </div>
                  <Switch
                    checked={notifications.changeNotifications}
                    onCheckedChange={(checked) =>
                      setNotifications((prev) => ({ ...prev, changeNotifications: checked }))
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Weekly Digest</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive a weekly summary of architecture changes
                    </p>
                  </div>
                  <Switch
                    checked={notifications.weeklyDigest}
                    onCheckedChange={(checked) =>
                      setNotifications((prev) => ({ ...prev, weeklyDigest: checked }))
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>
                  Customize how the application looks
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label>Theme</Label>
                  <div className="grid grid-cols-3 gap-4">
                    <button
                      type="button"
                      onClick={() => setTheme("light")}
                      className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        theme === "light" ? "border-primary bg-accent/10" : "border-border hover:border-primary/50"
                      }`}
                    >
                      {theme === "light" && (
                        <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                          <Check className="h-3 w-3 text-primary-foreground" />
                        </div>
                      )}
                      <div className="w-full h-16 rounded bg-gradient-to-br from-white to-slate-100 border mb-2 flex items-center justify-center">
                        <Sun className="h-6 w-6 text-amber-500" />
                      </div>
                      <p className="text-sm font-medium text-center">Light</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTheme("dark")}
                      className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        theme === "dark" ? "border-primary bg-accent/10" : "border-border hover:border-primary/50"
                      }`}
                    >
                      {theme === "dark" && (
                        <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                          <Check className="h-3 w-3 text-primary-foreground" />
                        </div>
                      )}
                      <div className="w-full h-16 rounded bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 mb-2 flex items-center justify-center">
                        <Moon className="h-6 w-6 text-blue-400" />
                      </div>
                      <p className="text-sm font-medium text-center">Dark</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTheme("system")}
                      className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        theme === "system" ? "border-primary bg-accent/10" : "border-border hover:border-primary/50"
                      }`}
                    >
                      {theme === "system" && (
                        <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                          <Check className="h-3 w-3 text-primary-foreground" />
                        </div>
                      )}
                      <div className="w-full h-16 rounded bg-gradient-to-r from-white to-slate-900 border mb-2 flex items-center justify-center">
                        <Monitor className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <p className="text-sm font-medium text-center">System</p>
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Select your preferred theme. System will follow your device settings.
                  </p>
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label>Sidebar</Label>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Default to collapsed sidebar on startup
                    </p>
                    <Switch
                      checked={collapsedSidebar}
                      onCheckedChange={handleSidebarToggle}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Manage your account security and authentication
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label>Change Password</Label>
                  
                  {passwordSuccess && (
                    <Alert className="border-accent/50 bg-accent/10">
                      <CheckCircle2 className="h-4 w-4 text-accent" />
                      <AlertDescription className="text-accent">
                        Password updated successfully!
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {(passwordErrors.currentPassword || passwordErrors.newPassword || passwordErrors.confirmPassword) && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        {passwordErrors.currentPassword || passwordErrors.newPassword || passwordErrors.confirmPassword}
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="grid gap-3">
                    <div className="space-y-1">
                      <Input
                        type="password"
                        placeholder="Current password"
                        value={passwordData.currentPassword}
                        onChange={(e) =>
                          setPasswordData((prev) => ({ ...prev, currentPassword: e.target.value }))
                        }
                        aria-invalid={!!passwordErrors.currentPassword}
                        disabled={changingPassword}
                      />
                    </div>
                    <div className="space-y-1">
                      <Input
                        type="password"
                        placeholder="New password"
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          setPasswordData((prev) => ({ ...prev, newPassword: e.target.value }))
                        }
                        aria-invalid={!!passwordErrors.newPassword}
                        disabled={changingPassword}
                      />
                      <p className="text-xs text-muted-foreground">
                        Min 8 characters with uppercase, lowercase, and number
                      </p>
                    </div>
                    <div className="space-y-1">
                      <Input
                        type="password"
                        placeholder="Confirm new password"
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          setPasswordData((prev) => ({ ...prev, confirmPassword: e.target.value }))
                        }
                        aria-invalid={!!passwordErrors.confirmPassword}
                        disabled={changingPassword}
                      />
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleChangePassword}
                    disabled={changingPassword || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                  >
                    {changingPassword ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      'Update Password'
                    )}
                  </Button>
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account
                  </p>
                  <Button variant="outline" disabled>
                    Enable 2FA (Coming Soon)
                  </Button>
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label className="text-destructive">Danger Zone</Label>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete your account and all associated data
                  </p>
                  <Button variant="destructive" size="sm" disabled>
                    Delete Account
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Contact an Enterprise Architect to delete your account
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default SettingsPage;
