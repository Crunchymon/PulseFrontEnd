import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle, Zap, Users, BarChart3, Shield, Clock, ArrowRight, Sparkles, TrendingUp, Activity, MessageSquare, HelpCircle } from "lucide-react";
import PulseLogo from "@/components/PulseLogo";

export default function App() {
    return (
        <div className="min-h-screen bg-black relative overflow-hidden">
            {/* Animated background gradient orbs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 -left-40 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl animate-pulse-glow"></div>
                <div className="absolute top-1/3 -right-40 w-96 h-96 bg-orange-600/5 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }}></div>
                <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-orange-400/5 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="relative z-10">
                {/* Navigation */}
                <nav className="border-b border-gray-800 bg-black/80 backdrop-blur-sm sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex justify-between items-center">
                            <PulseLogo size="small" />
                            <div className="flex items-center gap-4">
                                <Link href="/auth/login">
                                    <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-gray-800">Login</Button>
                                </Link>
                                <Link href="/auth/signup">
                                    <Button className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white border-0">Get Started</Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <section className="relative pt-20 pb-32 overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-900/20 via-black to-black pointer-events-none"></div>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="text-center max-w-4xl mx-auto">
                            <Badge className="mb-6 bg-orange-950/50 text-orange-400 hover:bg-orange-950/50 border border-orange-800 px-4 py-1.5 text-sm backdrop-blur-md animate-fade-in">
                                <Activity className="w-3.5 h-3.5 mr-2 animate-pulse" />
                                Real-Time Polling Made Simple
                            </Badge>
                            <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight">
                                <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent inline-block animate-float">
                                    Feel the Pulse
                                </span>
                                <br />
                                <span className="text-white inline-block animate-float-delayed">
                                    of Every Decision
                                </span>
                            </h1>
                            <p className="text-xl text-gray-400 mb-10 leading-relaxed max-w-2xl mx-auto">
                                Watch decisions come to life in real-time. No more endless chat threads or confusion. Just instant, visual consensus for teams that move fast.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 mb-12 justify-center">
                                <Link href="/auth/signup">
                                    <Button size="lg" className="h-12 px-8 text-lg bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 shadow-lg shadow-orange-500/20 border-0">
                                        Create Your First Poll
                                        <ArrowRight className="w-5 h-5 ml-2" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-24 bg-gray-900/30 relative">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
                                Everything You Need to{" "}
                                <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                                    Decide Faster
                                </span>
                            </h2>
                            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                                Powerful features designed to make group decision-making effortless and transparent.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <FeatureCard
                                icon={<Zap className="w-6 h-6 text-orange-500" />}
                                title="Real-Time Updates"
                                description="Watch votes come in live as they happen. Results update instantly for all participants."
                            />
                            <FeatureCard
                                icon={<Users className="w-6 h-6 text-orange-500" />}
                                title="Zero Friction Sharing"
                                description="Share polls with a simple link."
                            />
                            <FeatureCard
                                icon={<BarChart3 className="w-6 h-6 text-orange-500" />}
                                title="Visual Intelligence"
                                description="See poll results at a glance."
                            />
                            <FeatureCard
                                icon={<Shield className="w-6 h-6 text-orange-500" />}
                                title="Secure & Private"
                                description="Authenication ensures your data is safe."
                            />
                            <FeatureCard
                                icon={<Clock className="w-6 h-6 text-orange-500" />}
                                title="Smart Dashboard"
                                description="Organize all your polls in one place. Filter, search, and manage your decision history with ease."
                            />
                            <FeatureCard
                                icon={<CheckCircle className="w-6 h-6 text-orange-500" />}
                                title="Flexible Voting"
                                description="Change or Retract your vote at any time."
                            />
                        </div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section className="py-24 relative overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-900/10 via-transparent to-transparent pointer-events-none"></div>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="text-center mb-16">
                            <Badge className="mb-4 bg-orange-950/50 text-orange-400 border-orange-800">Community Love</Badge>
                            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
                                Trusted by Teams Everywhere
                            </h2>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            <TestimonialCard
                                quote="Pulse has completely transformed how our product team makes decisions. No more endless meetings!"
                                author="Sarah Jenkins"
                                role="Product Manager @ TechFlow"
                                avatar="SJ"
                            />
                            <TestimonialCard
                                quote="The real-time visualization is a game changer. We use it for everything from lunch picks to sprint planning."
                                author="David Chen"
                                role="Engineering Lead @ StartUp"
                                avatar="DC"
                            />
                            <TestimonialCard
                                quote="Simple, beautiful, and fast. Exactly what a modern polling tool should be. Highly recommended."
                                author="Emily Watson"
                                role="Designer @ CreativeStudio"
                                avatar="EW"
                            />
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="py-24 bg-gray-900/30">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
                                Frequently Asked Questions
                            </h2>
                            <p className="text-gray-400">Got questions? We've got answers.</p>
                        </div>

                        <Accordion type="single" collapsible className="w-full space-y-4">
                            <AccordionItem value="item-1" className="border-gray-800">
                                <AccordionTrigger className="text-white hover:text-orange-400 hover:no-underline">Is Pulse free to use?</AccordionTrigger>
                                <AccordionContent className="text-gray-400">
                                    Yes! Pulse offers a generous free tier that includes unlimited polls and votes. We also have premium plans for advanced features like team management and custom branding.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-2" className="border-gray-800">
                                <AccordionTrigger className="text-white hover:text-orange-400 hover:no-underline">Do voters need an account?</AccordionTrigger>
                                <AccordionContent className="text-gray-400">
                                    Yes to vote on a poll, you need to be logged in. This ensures that your votes are counted and that you can't vote multiple times.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-3" className="border-gray-800">
                                <AccordionTrigger className="text-white hover:text-orange-400 hover:no-underline">How secure is my data?</AccordionTrigger>
                                <AccordionContent className="text-gray-400">
                                    We take security seriously. All data is encrypted in transit and at rest. We use industry-standard authentication and security practices to protect your information.
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24 bg-gradient-to-br from-orange-600 via-orange-500 to-orange-600 text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2djRoLTR2LTRoNHptMCAwdi00aDR2NGgtNHptLTQgMGgtNHY0aDR2LTRabTAtNGg0di00aC00djRaIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                        <h2 className="text-4xl lg:text-5xl font-bold mb-8">
                            Ready to Transform Your Group Decisions?
                        </h2>
                        <p className="text-xl mb-10 text-orange-100 max-w-2xl mx-auto">
                            Join thousands of teams already making faster, clearer decisions with Pulse. Start for free today.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/auth/signup">
                                <Button size="lg" variant="secondary" className="bg-white text-orange-600 hover:bg-gray-100 h-14 px-8 text-lg font-semibold border-0">
                                    Create Your First Poll
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-gray-950 text-gray-400 py-16 border-t border-gray-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid md:grid-cols-4 gap-12 mb-12">
                            <div className="col-span-1 md:col-span-1">
                                <PulseLogo size="small" />
                                <p className="text-sm mt-6 leading-relaxed">
                                    Making group decisions simple, instant, and visual. The modern way to reach consensus.
                                </p>
                                <div className="flex gap-4 mt-6">
                                    {/* Social Icons Placeholder */}
                                    <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center hover:bg-orange-500 hover:text-white transition-colors cursor-pointer">
                                        <span className="sr-only">Twitter</span>
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
                                    </div>
                                    <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center hover:bg-orange-500 hover:text-white transition-colors cursor-pointer">
                                        <span className="sr-only">GitHub</span>
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
                                    </div>
                                </div>
                            </div>


                        </div>

                        <div className="border-t border-gray-800 pt-8 text-center text-sm flex flex-col md:flex-row justify-between items-center gap-4">
                            <p>© 2025 Pulse. All rights reserved.</p>
                            <div className="flex gap-6">
                                <span className="flex items-center gap-2"><div className="w-2 h-2 bg-green-500 rounded-full"></div> All Systems Operational</span>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <Card className="bg-gray-900/50 border-gray-800 hover:border-orange-600/50 transition-all hover:shadow-lg hover:shadow-orange-500/10 backdrop-blur-sm group">
            <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-orange-950/50 to-orange-900/30 rounded-lg flex items-center justify-center mb-4 border border-orange-800/30 group-hover:scale-110 transition-transform duration-300">
                    {icon}
                </div>
                <CardTitle className="text-white group-hover:text-orange-400 transition-colors">{title}</CardTitle>
                <CardDescription className="text-gray-400 leading-relaxed">
                    {description}
                </CardDescription>
            </CardHeader>
        </Card>
    );
}

function TestimonialCard({ quote, author, role, avatar }: { quote: string, author: string, role: string, avatar: string }) {
    return (
        <Card className="bg-gray-900/50 border-gray-800 hover:border-orange-600/30 transition-all p-6">
            <div className="mb-6 text-orange-500">
                <MessageSquare className="w-8 h-8 opacity-50" />
            </div>
            <p className="text-gray-300 mb-6 text-lg italic">"{quote}"</p>
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center text-white font-bold text-sm">
                    {avatar}
                </div>
                <div>
                    <div className="text-white font-semibold">{author}</div>
                    <div className="text-xs text-gray-500">{role}</div>
                </div>
            </div>
        </Card>
    );
}