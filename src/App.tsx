import React, { useState, useEffect, Component, ErrorInfo, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  Target, 
  Lightbulb, 
  ArrowRight, 
  Loader2, 
  Sparkles,
  ChevronRight,
  ClipboardList,
  History,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { analyzeResume, AnalysisResult } from '@/lib/gemini';
import { cn } from '@/lib/utils';

// Error Boundary Component
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-rose-50 p-4">
          <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-rose-100">
            <h2 className="text-2xl font-bold text-rose-600 mb-4">Something went wrong</h2>
            <p className="text-slate-600 mb-6">The application encountered an unexpected error. Please try refreshing the page.</p>
            <pre className="bg-slate-50 p-4 rounded-lg text-xs text-rose-500 overflow-auto max-h-40 mb-6">
              {this.state.error?.message}
            </pre>
            <Button onClick={() => window.location.reload()} className="w-full">
              Reload Application
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <MainApp />
    </ErrorBoundary>
  );
}

function MainApp() {
  const [jobDescription, setJobDescription] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<{ id: string; date: string; score: number; jobTitle: string }[]>([]);

  const handleAnalyze = async () => {
    if (!jobDescription || !resumeText) {
      setError('Please provide both a job description and a resume.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const analysis = await analyzeResume(jobDescription, resumeText);
      setResult(analysis);
      
      // Extract a likely job title from the first line of JD or similar
      const jobTitle = jobDescription.split('\n')[0].substring(0, 30) + '...';
      
      setHistory(prev => [
        { 
          id: Math.random().toString(36).substr(2, 9), 
          date: new Date().toLocaleString(), 
          score: analysis.score,
          jobTitle
        },
        ...prev
      ]);
    } catch (err) {
      console.error(err);
      setError('An error occurred during analysis. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearInputs = () => {
    setJobDescription('');
    setResumeText('');
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-900 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">G8 AI <span className="text-muted-foreground font-medium">Screener</span></h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="hidden sm:flex">
              <History className="w-4 h-4 mr-2" />
              History
            </Button>
            <Button variant="outline" size="sm" onClick={clearInputs}>
              Reset
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Input Section */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-primary" />
                  Job Description
                </h2>
                <Badge variant="secondary" className="font-mono text-[10px] uppercase tracking-wider">Required</Badge>
              </div>
              <Textarea 
                placeholder="Paste the job requirements here..." 
                className="min-h-[200px] resize-none bg-white border-slate-200 focus:ring-primary/20"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Resume Content
                </h2>
                <Badge variant="secondary" className="font-mono text-[10px] uppercase tracking-wider">Required</Badge>
              </div>
              <Textarea 
                placeholder="Paste the resume text here..." 
                className="min-h-[300px] resize-none bg-white border-slate-200 focus:ring-primary/20"
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
              />
            </div>

            <Button 
              className="w-full h-12 text-base font-semibold shadow-lg shadow-primary/10 transition-all hover:scale-[1.01] active:scale-[0.99]"
              onClick={handleAnalyze}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing Profile...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-5 w-5" />
                  Screen Resume
                </>
              )}
            </Button>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3 text-destructive text-sm"
              >
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p>{error}</p>
              </motion.div>
            )}
          </div>

          {/* Results Section */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {!result && !isAnalyzing ? (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full min-h-[600px] flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-200 rounded-2xl bg-white/50"
                >
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                    <Target className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Ready for Analysis</h3>
                  <p className="text-slate-500 max-w-md mx-auto">
                    Paste the job description and resume content on the left to get a detailed AI-powered compatibility report.
                  </p>
                </motion.div>
              ) : isAnalyzing ? (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full min-h-[600px] flex flex-col items-center justify-center text-center p-8 space-y-8"
                >
                  <div className="relative">
                    <div className="w-24 h-24 border-4 border-primary/10 border-t-primary rounded-full animate-spin" />
                    <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-primary animate-pulse" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-slate-900">AI is working...</h3>
                    <p className="text-slate-500">Comparing skills, experience, and keywords...</p>
                  </div>
                  <div className="w-full max-w-xs space-y-2">
                    <div className="flex justify-between text-xs font-mono text-slate-400 uppercase tracking-widest">
                      <span>Processing</span>
                      <span>Please wait</span>
                    </div>
                    <Progress value={66} className="h-1" />
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="result"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  {/* Score Card */}
                  <Card className="overflow-hidden border-none shadow-xl bg-white">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-2xl font-bold">Match Analysis</CardTitle>
                        <Badge className={cn(
                          "px-3 py-1 text-lg font-bold",
                          result.score >= 80 ? "bg-emerald-500" : 
                          result.score >= 60 ? "bg-amber-500" : "bg-rose-500"
                        )}>
                          {result.score}%
                        </Badge>
                      </div>
                      <CardDescription className="text-slate-500 pt-2 leading-relaxed">
                        {result.summary}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm font-medium">
                          <span>Compatibility Score</span>
                          <span>{result.score}/100</span>
                        </div>
                        <Progress 
                          value={result.score} 
                          className="h-3" 
                          // @ts-ignore
                          indicatorClassName={cn(
                            result.score >= 80 ? "bg-emerald-500" : 
                            result.score >= 60 ? "bg-amber-500" : "bg-rose-500"
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Tabs for Detailed View */}
                  <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 h-12 bg-slate-100 p-1 rounded-xl">
                      <TabsTrigger value="overview" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Overview</TabsTrigger>
                      <TabsTrigger value="keywords" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Keywords</TabsTrigger>
                      <TabsTrigger value="detailed" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Deep Dive</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="mt-6 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="border-slate-100 shadow-sm">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-bold flex items-center gap-2 text-emerald-600">
                              <CheckCircle2 className="w-4 h-4" />
                              Key Strengths
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-2">
                              {result.strengths.map((s, i) => (
                                <li key={i} className="text-sm flex items-start gap-2 text-slate-600">
                                  <ChevronRight className="w-4 h-4 mt-0.5 shrink-0 text-emerald-400" />
                                  {s}
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>

                        <Card className="border-slate-100 shadow-sm">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-bold flex items-center gap-2 text-rose-600">
                              <AlertCircle className="w-4 h-4" />
                              Gap Areas
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-2">
                              {result.weaknesses.map((w, i) => (
                                <li key={i} className="text-sm flex items-start gap-2 text-slate-600">
                                  <ChevronRight className="w-4 h-4 mt-0.5 shrink-0 text-rose-400" />
                                  {w}
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      </div>

                      <Card className="border-slate-100 shadow-sm bg-primary/5 border-primary/10">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-bold flex items-center gap-2 text-primary">
                            <Lightbulb className="w-4 h-4" />
                            Recommendations
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-3">
                            {result.recommendations.map((r, i) => (
                              <li key={i} className="text-sm flex items-start gap-3 text-slate-700 bg-white p-3 rounded-lg border border-primary/5">
                                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold shrink-0">
                                  {i + 1}
                                </span>
                                {r}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="keywords" className="mt-6">
                      <Card className="border-slate-100 shadow-sm">
                        <CardHeader>
                          <CardTitle className="text-lg">Missing Keywords</CardTitle>
                          <CardDescription>Skills and terms from the JD not found in the resume.</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            {result.missingKeywords.length > 0 ? (
                              result.missingKeywords.map((k, i) => (
                                <Badge key={i} variant="outline" className="bg-slate-50 text-slate-600 border-slate-200 px-3 py-1">
                                  {k}
                                </Badge>
                              ))
                            ) : (
                              <p className="text-sm text-slate-500 italic">No major missing keywords found!</p>
                            )}
                          </div>
                        </CardContent>
                        <CardFooter className="bg-slate-50/50 border-t px-6 py-4">
                          <p className="text-xs text-slate-500 flex items-center gap-2">
                            <Target className="w-3 h-3" />
                            Adding these keywords can help pass ATS filters.
                          </p>
                        </CardFooter>
                      </Card>
                    </TabsContent>

                    <TabsContent value="detailed" className="mt-6">
                      <Card className="border-slate-100 shadow-sm">
                        <CardHeader>
                          <CardTitle className="text-lg">Detailed AI Analysis</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ScrollArea className="h-[400px] pr-4">
                            <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                              {result.detailedAnalysis}
                            </div>
                          </ScrollArea>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* History Section */}
        {history.length > 0 && (
          <section className="mt-20 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight">Recent Scans</h2>
              <Button variant="ghost" size="sm" onClick={() => setHistory([])} className="text-slate-500 hover:text-rose-600">
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {history.map((item) => (
                <Card key={item.id} className="border-slate-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start">
                      <Badge variant="outline" className="text-[10px] uppercase font-mono">{item.date.split(',')[0]}</Badge>
                      <span className={cn(
                        "text-sm font-bold",
                        item.score >= 80 ? "text-emerald-500" : 
                        item.score >= 60 ? "text-amber-500" : "text-rose-500"
                      )}>
                        {item.score}%
                      </span>
                    </div>
                    <CardTitle className="text-sm mt-2 line-clamp-1 group-hover:text-primary transition-colors">{item.jobTitle}</CardTitle>
                  </CardHeader>
                  <CardFooter className="p-4 pt-0">
                    <Button variant="link" className="p-0 h-auto text-xs text-slate-400 group-hover:text-primary">
                      View Report <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t bg-white py-12">
        <div className="container mx-auto px-4 text-center space-y-4">
          <div className="flex items-center justify-center gap-2 opacity-50">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-bold tracking-tight uppercase">G8 AI Engine</span>
          </div>
          <p className="text-xs text-slate-400">
            Powered by Gemini 3 Flash. Built for modern hiring.
          </p>
        </div>
      </footer>
    </div>
  );
}
