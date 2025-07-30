/* eslint-disable react/no-unescaped-entities */
import { LoginForm } from "@/components/ui/login-form"
import { Shield, Users, BarChart3, Settings } from "lucide-react"

const LetsCodeLogo = "https://d3l4smlx4vuygm.cloudfront.net/IMG_20250123_135429_806.webp"

export default function AdminLoginPage() {
  return (
    <div className="grid h-screen lg:grid-cols-2">
      {/* Left side - Admin Login Form */}
      <div className="flex flex-col gap-6 p-6 md:p-10 bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3 md:justify-start justify-center">
          <div className="relative h-12 w-12 overflow-hidden rounded-xl shadow-lg ring-1 ring-slate-200 dark:ring-slate-800">
            <img
              src={LetsCodeLogo || "/placeholder.svg"}
              alt="Let's Code Logo"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-slate-900 dark:text-slate-100">Let's Code</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">ADMIN PORTAL</span>
          </div>
        </div>

        {/* Admin Login Form Container */}
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-8 shadow-2xl">
              <LoginForm />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center space-y-2">
          <p className="text-xs text-slate-500 dark:text-slate-400">© 2024 Let's Code. Admin Portal v2.1.0</p>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            For technical support, contact IT at support@letscode.com
          </p>
        </div>
      </div>

      {/* Right side - Admin Dashboard Preview */}
      <div className="relative hidden lg:block overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center h-full p-12 text-white">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                <Shield className="h-4 w-4" />
                <span className="text-sm font-medium">Secure Admin Access</span>
              </div>
              <h2 className="text-4xl font-bold leading-tight">Manage your platform with confidence</h2>
              <p className="text-lg text-slate-300 max-w-md leading-relaxed">
                Access comprehensive analytics, user management, and system controls from your secure admin dashboard.
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 gap-4 max-w-md">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <Users className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">User Management</h3>
                  <p className="text-xs text-slate-400">Manage user accounts and permissions</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="p-2 rounded-lg bg-green-500/20">
                  <BarChart3 className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Analytics Dashboard</h3>
                  <p className="text-xs text-slate-400">Monitor platform performance</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="p-2 rounded-lg bg-purple-500/20">
                  <Settings className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">System Configuration</h3>
                  <p className="text-xs text-slate-400">Configure platform settings</p>
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-amber-400 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm text-amber-400">Security Notice</h3>
                  <p className="text-xs text-amber-200/80 mt-1">
                    All admin activities are monitored and logged for security purposes. Ensure you're accessing from a
                    secure network.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 right-20 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute bottom-32 left-20 h-24 w-24 rounded-full bg-purple-500/10 blur-2xl" />
        <div className="absolute top-1/2 right-10 h-16 w-16 rounded-full bg-green-500/10 blur-xl" />
      </div>
    </div>
  )
}
