import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  Robot, 
  Send, 
  Sparkle, 
  Navigation, 
  Clock, 
  DollarSign,
  Users,
  Car
} from "@phosphor-icons/react";

interface AIAssistantProps {
  driverLocation: { lat: number; lng: number };
  isOnline: boolean;
  onClose: () => void;
}

export function AIAssistant({ driverLocation, isOnline, onClose }: AIAssistantProps) {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    {
      role: 'assistant',
      content: "Hi! I'm your AI driving assistant. I can help you with navigation tips, earnings optimization, safety advice, and general driving questions. How can I assist you today?"
    }
  ]);

  const quickActions = [
    { 
      icon: Navigation, 
      label: "Best routes nearby", 
      prompt: "What are the best routes and areas to drive in right now for maximum earnings?" 
    },
    { 
      icon: Clock, 
      label: "Peak hours advice", 
      prompt: "When are the peak hours in my area and how can I maximize my earnings?" 
    },
    { 
      icon: DollarSign, 
      label: "Earnings tips", 
      prompt: "Give me tips to increase my daily earnings as a rideshare driver" 
    },
    { 
      icon: Users, 
      label: "Customer service", 
      prompt: "How can I provide better customer service and improve my ratings?" 
    },
    { 
      icon: Car, 
      label: "Vehicle maintenance", 
      prompt: "What maintenance should I do to keep my vehicle in good condition for rideshare?" 
    }
  ];

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    setIsLoading(true);
    const userMessage = { role: 'user' as const, content: message };
    setMessages(prev => [...prev, userMessage]);
    setInput("");

    try {
      const context = `You are an AI assistant for rideshare drivers. The driver is currently ${isOnline ? 'online' : 'offline'} and located at coordinates ${driverLocation.lat}, ${driverLocation.lng}. Provide helpful, practical advice for rideshare driving.`;
      
      const prompt = spark.llmPrompt`${context}

Driver's question: ${message}

Please provide a helpful, concise response (2-3 sentences max) that's specifically relevant to rideshare driving.`;

      const response = await spark.llm(prompt, "gpt-4o-mini");
      
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      toast.error("Failed to get AI response. Please try again.");
      console.error('AI Assistant error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (prompt: string) => {
    handleSendMessage(prompt);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg">
            <Robot size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold">AI Assistant</h2>
            <p className="text-sm text-muted-foreground">Your intelligent driving companion</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={onClose}>
          Close
        </Button>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Sparkle size={16} />
            Quick Help
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="ghost"
              className="w-full justify-start gap-3 h-auto p-3"
              onClick={() => handleQuickAction(action.prompt)}
              disabled={isLoading}
            >
              <action.icon size={16} className="text-muted-foreground" />
              <span className="text-sm">{action.label}</span>
            </Button>
          ))}
        </CardContent>
      </Card>

      {/* Chat Messages */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Conversation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="max-h-64 overflow-y-auto space-y-3">
            {messages.map((message, index) => (
              <div key={index} className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-lg ${
                  message.role === 'user' 
                    ? 'bg-primary text-primary-foreground ml-auto' 
                    : 'bg-muted'
                }`}>
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="bg-muted p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="flex gap-2">
            <Textarea
              placeholder="Ask me anything about driving..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(input);
                }
              }}
              className="min-h-[40px] max-h-[100px] resize-none"
              disabled={isLoading}
            />
            <Button 
              onClick={() => handleSendMessage(input)}
              disabled={isLoading || !input.trim()}
              size="sm"
              className="shrink-0"
            >
              <Send size={16} />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}