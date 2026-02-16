import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useMemo, Activity } from "react";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { llmCheck } from "../lib/llmCheck";
import LLMResponse from "./LLMResponse";
import { toast } from "sonner";

export default function ResponseCheck() {
  const [emailBody, setEmailBody] = useState<string>("");
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [result, setResult] = useState<any | null>();

  const isButtonDisabled = useMemo(() => emailBody.trim().length === 0 || isChecking, [emailBody]);

  const handleSubmit = async () => {
    setResult(null);
    setIsChecking(true);
    try {
      const response = await llmCheck(emailBody);
      setIsChecking(false);
      setResult(response);
    } catch (e: any) {
      setIsChecking(false);
      setResult(null);
      toast.error("Error, please try again", { description: e, position: 'bottom-left'})
    }
  };
  return (
    <>
      <h1 className="text-center text-4xl font-bold pb-4">Did a recruiter actually read your application?</h1>
      <Card className="mt-4 shadow-xl">
        <CardHeader className="gap-4">
          <CardTitle className="text-2xl font-bold">Let's see if a human responded to your application</CardTitle>
          <CardDescription>
            <span>ATS rejections are just rude</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea id="email-input" className="min-h-[10em]" value={emailBody} onChange={(e) => setEmailBody(e.target.value)} placeholder="Paste your email response here to parse it." />
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button variant={"outline"} disabled={isButtonDisabled} onClick={handleSubmit}>{isChecking ? <Loader2 className="mx-4 animate-spin" /> : "Check"}</Button>
        </CardFooter>
      </Card>
      <Activity mode={result ? 'visible' : 'hidden'}>
        <LLMResponse {...result} />
      </Activity>
    </>
  );
}