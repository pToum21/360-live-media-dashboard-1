import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { UserNav } from "@/components/auth/user-nav";
import { 
  BarChart3, 
  Mail, 
  Users, 
  TrendingUp, 
  Zap, 
  Clock,
  ArrowRight,
  CheckCircle2,
  Sparkles
} from "lucide-react";

export default async function Home() {
  const session = await getServerSession(authOptions);
  
  // Redirect logged-in users to dashboard
  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center">
              <Image 
                src="/Logos/Info=Basic, Color=Green.png" 
                alt="360 Live Media Logo" 
                width={40}
                height={40}
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-bold text-xl text-[#0C1C14]">Live Media</span>
          </div>
          <UserNav />
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-20 pb-16">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <Badge className="mb-6 bg-[#84BE41]/10 text-[#2E8741] hover:bg-[#84BE41]/20 border-[#84BE41]/20">
            <Sparkles className="w-3 h-3 mr-1" />
            Internal Tool - 360 Marketing Team
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-[#0C1C14] tracking-tight">
            Marketing Dashboard
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto">
            Your marketing data from scattered Excel sheets, now in one{" "}
            <span className="text-[#2E8741] font-semibold">unified, automated dashboard</span>.
            Track website analytics, email campaigns, and social media—all in real-time.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-[#2E8741] hover:bg-[#2E8741]/90 text-white shadow-lg shadow-[#2E8741]/20 group">
              Sign In to Dashboard
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-8 border-t">
            <div>
              <div className="text-3xl font-bold text-[#2E8741]">120hrs</div>
              <div className="text-sm text-gray-600">Saved per year</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#2E8741]">5+</div>
              <div className="text-sm text-gray-600">Data sources</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#2E8741]">Real-time</div>
              <div className="text-sm text-gray-600">Auto-sync</div>
            </div>
          </div>
        </div>

        {/* Dashboard Preview Mock */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="bg-gradient-to-br from-[#103d27] to-[#2E8741] rounded-2xl shadow-2xl p-8 border border-[#84BE41]/20">
            <div className="bg-white rounded-xl shadow-xl overflow-hidden">
              <div className="bg-gray-50 border-b px-6 py-4 flex items-center gap-2">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="text-sm text-gray-500 ml-4">360 Marketing Dashboard</div>
              </div>
              <div className="grid grid-cols-3 gap-4 p-6 bg-gradient-to-br from-white to-gray-50">
                <div className="bg-white p-6 rounded-lg border shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-[#2E8741]/10 rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-[#2E8741]" />
                    </div>
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  </div>
                  <div className="text-2xl font-bold text-[#0C1C14] mb-1">1,234</div>
                  <div className="text-sm text-gray-500">Website Users</div>
                </div>
                <div className="bg-white p-6 rounded-lg border shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-[#2E8741]/10 rounded-lg flex items-center justify-center">
                      <Mail className="w-5 h-5 text-[#2E8741]" />
                    </div>
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  </div>
                  <div className="text-2xl font-bold text-[#0C1C14] mb-1">15.3%</div>
                  <div className="text-sm text-gray-500">Email Open Rate</div>
                </div>
                <div className="bg-white p-6 rounded-lg border shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-[#2E8741]/10 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-[#2E8741]" />
                    </div>
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  </div>
                  <div className="text-2xl font-bold text-[#0C1C14] mb-1">4,891</div>
                  <div className="text-sm text-gray-500">Social Reach</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-[#0C1C14]">What&apos;s Tracked</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            All your marketing metrics in one place. Updated automatically.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="border-2 hover:border-[#2E8741] transition-all hover:shadow-lg group">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-[#2E8741] to-[#84BE41] rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-2xl">Website Analytics</CardTitle>
              <CardDescription>Real-time traffic and engagement metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#2E8741] mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-600">Auto-sync from Google Analytics</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#2E8741] mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-600">SEMrush health scores</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#2E8741] mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-600">UTM campaign tracking</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-[#2E8741] transition-all hover:shadow-lg group">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-[#2E8741] to-[#84BE41] rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-2xl">Email Campaigns</CardTitle>
              <CardDescription>Monitor newsletter and campaign performance</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#2E8741] mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-600">MailChimp integration</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#2E8741] mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-600">Open & click tracking</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#2E8741] mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-600">Deliverability insights</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-[#2E8741] transition-all hover:shadow-lg group">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-[#2E8741] to-[#84BE41] rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-2xl">Social Media</CardTitle>
              <CardDescription>LinkedIn & Instagram performance tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#2E8741] mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-600">Multi-platform sync</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#2E8741] mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-600">Content tagging system</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#2E8741] mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-600">Engagement analytics</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gradient-to-br from-[#103d27] to-[#2E8741] py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center text-white">
            <h2 className="text-4xl font-bold mb-6">
              Built to Save You <span className="text-[#84BE41]">Time</span>
            </h2>
            <p className="text-lg mb-12 text-white/90 max-w-2xl mx-auto">
              No more spending 2-3 hours every week copying data from multiple platforms 
              into Excel. Focus on strategy, content, and growth instead.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#84BE41] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-[#0C1C14]" />
                </div>
                <h3 className="font-semibold text-xl mb-2">Automated Sync</h3>
                <p className="text-white/80">Connect once, update forever. No manual work required.</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-[#84BE41] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-[#0C1C14]" />
                </div>
                <h3 className="font-semibold text-xl mb-2">Real-Time Data</h3>
                <p className="text-white/80">Make decisions on current data, not week-old numbers.</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-[#84BE41] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-[#0C1C14]" />
                </div>
                <h3 className="font-semibold text-xl mb-2">Clear Insights</h3>
                <p className="text-white/80">Visual charts and trends that tell the real story.</p>
              </div>
            </div>

            <div className="mt-12 pt-12 border-t border-white/20">
              <p className="text-white/70 mb-2">🚀 Development Status</p>
              <div className="flex items-center justify-center gap-6 text-sm">
                <span className="text-[#84BE41]">✅ UI Components</span>
                <span className="text-white/50">•</span>
                <span className="text-white/70">🚧 Database Setup</span>
                <span className="text-white/50">•</span>
                <span className="text-white/70">⏳ Authentication</span>
                <span className="text-white/50">•</span>
                <span className="text-white/70">⏳ API Integration</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center">
              <Image 
                src="/Logos/Info=Basic, Color=Green.png" 
                alt="360 Live Media Logo" 
                width={32}
                height={32}
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-bold text-lg text-[#0C1C14]">Live Media</span>
          </div>
          <p className="text-sm text-gray-600 mb-2">
            A Smithbucklin Company
          </p>
          <p className="text-xs text-gray-500">
            © 2026 360 Live Media. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
