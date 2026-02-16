import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

export default function LLMResponse({ analysis, reasoning, confidence_score }: { analysis: string, reasoning: string, confidence_score: string }) {
    return (
        <Card className="mt-4 shadow-xl">
            <CardHeader className="gap-4">
                <CardTitle className="text-2xl font-bold">{analysis}</CardTitle>
            </CardHeader>
            <CardContent>
                <div>
                    <span className="block font-bold">Reasoning:</span>
                    <span>{reasoning ?? 'Did not receive a value :('}</span>
                </div>
            </CardContent>
            <CardFooter>
                <span>Confidence Score: {confidence_score ?? 'I did not receive a score :('}</span>
            </CardFooter>
        </Card>
    )
}