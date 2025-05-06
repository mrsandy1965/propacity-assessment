"use client";

import { useState, useEffect, useTransition } from "react";
import type { UserReview } from "@/services/data-fetcher";
import { fetchUserReviews, MOCK_DATA_SOURCES } from "@/services/data-fetcher";
import { summarizeReviews } from "@/ai/flows/summarize-reviews";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, MessageSquareQuote, ThumbsUp, ThumbsDown, Wand2, FileText, Lightbulb, Bug } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import Image from 'next/image';


const SentimentIcon = ({ sentiment }: { sentiment: string }) => {
  switch (sentiment.toLowerCase()) {
    case "positive":
      return <ThumbsUp className="h-5 w-5 text-green-500" />;
    case "negative":
      return <ThumbsDown className="h-5 w-5 text-red-500" />;
    default:
      return <MessageSquareQuote className="h-5 w-5 text-muted-foreground" />;
  }
};

const FeedbackCategoryIcon = ({ text }: { text: string }) => {
  const lowerText = text.toLowerCase();
  if (lowerText.includes("bug") || lowerText.includes("crash") || lowerText.includes("error")) {
    return <Bug className="h-5 w-5 text-red-400 mr-2" />;
  }
  if (lowerText.includes("feature") || lowerText.includes("request") || lowerText.includes("idea")) {
    return <Lightbulb className="h-5 w-5 text-yellow-400 mr-2" />;
  }
  if (lowerText.includes("ui") || lowerText.includes("ux") || lowerText.includes("usability") || lowerText.includes("design")) {
    return <Wand2 className="h-5 w-5 text-blue-400 mr-2" />;
  }
  return <FileText className="h-5 w-5 text-gray-400 mr-2" />;
};


export function ReviewInsightsDashboard() {
  const [selectedSource, setSelectedSource] = useState<string>(MOCK_DATA_SOURCES[0].value);
  const [reviews, setReviews] = useState<UserReview[]>([]);
  const [summary, setSummary] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleFetchReviews = async () => {
    if (!selectedSource) {
      toast({
        title: "Error",
        description: "Please select a data source.",
        variant: "destructive",
      });
      return;
    }
    setIsFetching(true);
    setSummary(null); // Clear previous summary
    try {
      const product = selectedSource === "google_play_awesomeapp" ? "AwesomeApp" : "GenericProduct";
      const fetchedReviews = await fetchUserReviews(selectedSource, product);
      setReviews(fetchedReviews);
      toast({
        title: "Success",
        description: `Fetched ${fetchedReviews.length} reviews from ${MOCK_DATA_SOURCES.find(s => s.value === selectedSource)?.label}.`,
      });
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast({
        title: "Error",
        description: "Failed to fetch reviews. Please try again.",
        variant: "destructive",
      });
      setReviews([]);
    }
    setIsFetching(false);
  };

  const handleSummarizeReviews = async () => {
    if (reviews.length === 0) {
      toast({
        title: "No Reviews",
        description: "Please fetch reviews before summarizing.",
        variant: "destructive",
      });
      return;
    }
    setIsSummarizing(true);
    startTransition(async () => {
      try {
        const result = await summarizeReviews({ reviews });
        setSummary(result.summary);
        toast({
          title: "Summary Generated",
          description: "AI has successfully summarized the reviews.",
        });
      } catch (error) {
        console.error("Error summarizing reviews:", error);
        toast({
          title: "Error",
          description: "Failed to summarize reviews. Please try again.",
          variant: "destructive",
        });
        setSummary(null);
      }
      setIsSummarizing(false);
    });
  };
  
  // Fetch initial reviews on component mount
  useEffect(() => {
    handleFetchReviews();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSource]);


  return (
    <div className="container mx-auto py-8 px-4 md:px-0">
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-primary via-secondary to-accent text-transparent bg-clip-text">
          Review Insights
        </h1>
        <p className="text-xl text-muted-foreground mt-2">
          AI-Powered Feedback Analyzer for Your Products
        </p>
      </header>

      <Card className="mb-8 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl">Data Source Selection</CardTitle>
          <CardDescription>Choose a mock data source to fetch reviews or tweets.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row items-center gap-4">
          <Select onValueChange={setSelectedSource} defaultValue={selectedSource}>
            <SelectTrigger className="w-full sm:w-[280px] text-base py-3">
              <SelectValue placeholder="Select data source" />
            </SelectTrigger>
            <SelectContent>
              {MOCK_DATA_SOURCES.map((source) => (
                <SelectItem key={source.value} value={source.value} className="text-base">
                  {source.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            onClick={handleFetchReviews} 
            disabled={isFetching || isPending} 
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground py-3 px-6"
            aria-label="Fetch Reviews"
          >
            {isFetching ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <FileText className="mr-2 h-5 w-5" />
            )}
            Fetch Reviews
          </Button>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <FileText className="mr-3 h-7 w-7 text-primary" /> User Reviews
            </CardTitle>
            <CardDescription>Original feedback fetched from the selected source.</CardDescription>
          </CardHeader>
          <CardContent>
            {isFetching ? (
              <div className="flex justify-center items-center h-[300px]">
                <Loader2 className="h-12 w-12 animate-spin text-accent" />
              </div>
            ) : reviews.length > 0 ? (
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <Card key={review.id} className="bg-card/50 border-border/50">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                           <Badge variant={review.sentiment === 'positive' ? 'default' : review.sentiment === 'negative' ? 'destructive' : 'secondary'} className="capitalize text-xs">
                             {review.sentiment}
                           </Badge>
                           <SentimentIcon sentiment={review.sentiment} />
                        </div>
                        <p className="text-sm text-foreground/90 mb-3 leading-relaxed flex items-start">
                          <FeedbackCategoryIcon text={review.text} />
                          {review.text}
                        </p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Source: {review.source}</span>
                          <span>Product: {review.product}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <Alert variant="default" className="bg-card/30">
                 <Image src="https://picsum.photos/seed/no-reviews/400/200" alt="No reviews illustration" width={400} height={200} className="mx-auto mb-4 rounded-lg opacity-70" data-ai-hint="empty state illustration" />
                <AlertTitle className="font-semibold">No Reviews Yet</AlertTitle>
                <AlertDescription>
                  No reviews found for the selected source, or data is still loading. Try fetching again.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <Wand2 className="mr-3 h-7 w-7 text-accent" /> AI-Generated Summary
            </CardTitle>
            <CardDescription>Key pain points, feature requests, and positive feedback identified by AI.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleSummarizeReviews} 
              disabled={isSummarizing || reviews.length === 0 || isPending} 
              className="w-full mb-6 bg-accent hover:bg-accent/90 text-accent-foreground py-3 px-6"
              aria-label="Generate AI Summary"
            >
              {isSummarizing || isPending ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Wand2 className="mr-2 h-5 w-5" />
              )}
              Generate AI Summary
            </Button>
            {isSummarizing || isPending ? (
              <div className="flex justify-center items-center h-[300px]">
                <Loader2 className="h-12 w-12 animate-spin text-accent" />
              </div>
            ) : summary ? (
              <ScrollArea className="h-[320px] pr-4">
                <div className="prose prose-sm dark:prose-invert max-w-none p-4 bg-card/50 rounded-lg border border-border/50">
                  {summary.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-3 last:mb-0 leading-relaxed">{paragraph}</p>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <Alert variant="default" className="bg-card/30">
                 <Image src="https://picsum.photos/seed/no-summary/400/200" alt="No summary illustration" width={400} height={200} className="mx-auto mb-4 rounded-lg opacity-70" data-ai-hint="empty state abstract" />
                <AlertTitle className="font-semibold">Summary Awaits</AlertTitle>
                <AlertDescription>
                  {reviews.length > 0 ? "Click the button above to generate an AI summary of the reviews." : "Fetch some reviews first, then generate a summary."}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
      <footer className="mt-12 text-center text-muted-foreground text-sm">
        <Separator className="my-6" />
        <p>&copy; {new Date().getFullYear()} Review Insights. Powered by GenAI.</p>
        <p>Designed to help Product Managers prioritize effectively.</p>
      </footer>
    </div>
  );
}
