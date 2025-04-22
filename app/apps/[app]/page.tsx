"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

// App implementations
const APP_IMPLEMENTATIONS: Record<string, React.FC> = {
  "ai-assistant": AIAssistant,
  calculator: AdvancedCalculator,
  "essay-generator": EssayGenerator,
  summarizer: TextSummarizer,
  "code-helper": CodeHelper,
  "math-solver": MathSolver,
}

export default function AppPage() {
  const params = useParams()
  const appId = params.app as string
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const AppComponent = APP_IMPLEMENTATIONS[appId]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-900">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
          <p className="mt-2">Loading app...</p>
        </div>
      </div>
    )
  }

  if (!AppComponent) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">App Not Found</h1>
          <p className="text-zinc-400">The app "{appId}" is not available.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-900 p-4">
      <AppComponent />
    </div>
  )
}

// App implementations
function AIAssistant() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    {
      role: "assistant",
      content: "Hello! I'm your AI assistant. How can I help you with your homework or assignments today?",
    },
  ])
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    // Add user message
    setMessages((prev) => [...prev, { role: "user", content: input }])
    setLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "Here's the answer to your question...",
        "Based on my analysis, the solution is...",
        "I've researched this topic and found that...",
        "The answer to this problem is...",
        "According to my knowledge, the best approach is...",
      ]

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            responses[Math.floor(Math.random() * responses.length)] +
            " Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        },
      ])
      setLoading(false)
      setInput("")
    }, 1500)
  }

  return (
    <div className="max-w-2xl mx-auto bg-zinc-800 rounded-lg overflow-hidden flex flex-col h-[80vh]">
      <div className="p-4 border-b border-zinc-700">
        <h1 className="text-xl font-bold">AI Assistant</h1>
        <p className="text-sm text-zinc-400">Get homework help and answers</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === "user" ? "bg-emerald-600 text-white" : "bg-zinc-700 text-zinc-100"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-zinc-700 rounded-lg p-3 flex items-center space-x-2">
              <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
              <div
                className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              ></div>
              <div
                className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              ></div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-zinc-700 flex gap-2">
        <Input
          placeholder="Ask anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-zinc-700 border-zinc-600"
        />
        <Button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-700">
          Send
        </Button>
      </form>
    </div>
  )
}

function AdvancedCalculator() {
  const [input, setInput] = useState("")
  const [result, setResult] = useState("")
  const [history, setHistory] = useState<{ calculation: string; result: string }[]>([])

  const handleCalculate = () => {
    try {
      // This is just for demonstration - in a real app, you'd use a safer evaluation method
      const calculatedResult = eval(input).toString()
      setResult(calculatedResult)
      setHistory((prev) => [...prev, { calculation: input, result: calculatedResult }])
    } catch (error) {
      setResult("Error")
    }
  }

  const buttons = ["7", "8", "9", "/", "4", "5", "6", "*", "1", "2", "3", "-", "0", ".", "=", "+"]

  return (
    <div className="max-w-md mx-auto bg-zinc-800 rounded-lg overflow-hidden">
      <div className="p-4 border-b border-zinc-700">
        <h1 className="text-xl font-bold">Advanced Calculator</h1>
        <p className="text-sm text-zinc-400">Scientific calculator with step-by-step solutions</p>
      </div>

      <div className="p-4">
        <div className="bg-zinc-900 p-4 rounded-lg mb-4">
          <div className="text-sm text-zinc-400 mb-1">{input || "Enter calculation"}</div>
          <div className="text-2xl font-bold">{result || "0"}</div>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {buttons.map((btn) => (
            <Button
              key={btn}
              className={`aspect-square text-lg ${
                btn === "=" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-zinc-700 hover:bg-zinc-600"
              }`}
              onClick={() => {
                if (btn === "=") {
                  handleCalculate()
                } else {
                  setInput((prev) => prev + btn)
                }
              }}
            >
              {btn}
            </Button>
          ))}
        </div>

        <div className="mt-4">
          <Button
            variant="outline"
            className="w-full border-zinc-700"
            onClick={() => {
              setInput("")
              setResult("")
            }}
          >
            Clear
          </Button>
        </div>

        {history.length > 0 && (
          <div className="mt-4 border-t border-zinc-700 pt-4">
            <h3 className="text-sm font-medium mb-2">History</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {history.map((item, index) => (
                <div key={index} className="text-sm">
                  <span className="text-zinc-400">{item.calculation}</span>
                  <span className="text-zinc-400"> = </span>
                  <span className="text-emerald-500">{item.result}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function EssayGenerator() {
  const [topic, setTopic] = useState("")
  const [length, setLength] = useState("medium")
  const [generating, setGenerating] = useState(false)
  const [essay, setEssay] = useState("")

  const handleGenerate = () => {
    if (!topic) return

    setGenerating(true)
    setEssay("")

    // Simulate essay generation
    setTimeout(() => {
      const intro = `Introduction to ${topic}: This essay explores the fascinating subject of ${topic} and its implications in our modern world.`

      const body = `
      There are several key aspects to consider when discussing ${topic}. First, we must acknowledge its historical context and development over time. Scholars have long debated the significance of ${topic} in various fields.
      
      Furthermore, recent studies have shown that ${topic} has profound effects on society, economics, and culture. As we analyze these effects, we can better understand the complex nature of ${topic} and its role in shaping our future.
      
      The evidence supporting the importance of ${topic} is substantial. Multiple research papers have documented the correlation between ${topic} and improved outcomes in related areas. Critics, however, point out potential limitations in these studies.
      `

      const conclusion = `In conclusion, ${topic} represents a critical area of study that deserves continued attention and research. By understanding ${topic} more deeply, we can harness its potential for positive change while mitigating any negative consequences.`

      setEssay(`${intro}\n\n${body}\n\n${conclusion}`)
      setGenerating(false)
    }, 2000)
  }

  return (
    <div className="max-w-2xl mx-auto bg-zinc-800 rounded-lg overflow-hidden">
      <div className="p-4 border-b border-zinc-700">
        <h1 className="text-xl font-bold">Essay Generator</h1>
        <p className="text-sm text-zinc-400">Generate essays on any topic</p>
      </div>

      <div className="p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Essay Topic</label>
          <Input
            placeholder="Enter your essay topic..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full bg-zinc-700 border-zinc-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Essay Length</label>
          <div className="flex space-x-2">
            {["short", "medium", "long"].map((option) => (
              <Button
                key={option}
                type="button"
                variant={length === option ? "default" : "outline"}
                className={length === option ? "bg-emerald-600 hover:bg-emerald-700" : "border-zinc-700"}
                onClick={() => setLength(option)}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        <Button
          className="w-full bg-emerald-600 hover:bg-emerald-700"
          disabled={!topic || generating}
          onClick={handleGenerate}
        >
          {generating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate Essay"
          )}
        </Button>

        {essay && (
          <div className="mt-4">
            <label className="block text-sm font-medium mb-1">Generated Essay</label>
            <div className="bg-zinc-900 p-4 rounded-lg">
              <Textarea
                value={essay}
                readOnly
                className="w-full h-64 bg-zinc-900 border-none focus-visible:ring-0 resize-none"
              />
            </div>
            <div className="flex justify-end mt-2">
              <Button
                variant="outline"
                className="border-zinc-700"
                onClick={() => {
                  navigator.clipboard.writeText(essay)
                }}
              >
                Copy to Clipboard
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function TextSummarizer() {
  const [text, setText] = useState("")
  const [summarizing, setSummarizing] = useState(false)
  const [summary, setSummary] = useState("")

  const handleSummarize = () => {
    if (!text) return

    setSummarizing(true)
    setSummary("")

    // Simulate summarization
    setTimeout(() => {
      // Just take the first sentence and add a generic summary
      const firstSentence = text.split(".")[0]
      setSummary(
        `${firstSentence}. This text discusses key concepts and ideas related to the main topic. The author presents several arguments and supporting evidence throughout the content.`,
      )
      setSummarizing(false)
    }, 1500)
  }

  return (
    <div className="max-w-2xl mx-auto bg-zinc-800 rounded-lg overflow-hidden">
      <div className="p-4 border-b border-zinc-700">
        <h1 className="text-xl font-bold">Text Summarizer</h1>
        <p className="text-sm text-zinc-400">Summarize long texts quickly</p>
      </div>

      <div className="p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Original Text</label>
          <Textarea
            placeholder="Paste your text here to summarize..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-40 bg-zinc-700 border-zinc-600 resize-none"
          />
        </div>

        <Button
          className="w-full bg-emerald-600 hover:bg-emerald-700"
          disabled={!text || summarizing}
          onClick={handleSummarize}
        >
          {summarizing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Summarizing...
            </>
          ) : (
            "Summarize Text"
          )}
        </Button>

        {summary && (
          <div className="mt-4">
            <label className="block text-sm font-medium mb-1">Summary</label>
            <div className="bg-zinc-900 p-4 rounded-lg">
              <p className="text-zinc-100">{summary}</p>
            </div>
            <div className="flex justify-end mt-2">
              <Button
                variant="outline"
                className="border-zinc-700"
                onClick={() => {
                  navigator.clipboard.writeText(summary)
                }}
              >
                Copy to Clipboard
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function CodeHelper() {
  const [language, setLanguage] = useState("javascript")
  const [prompt, setPrompt] = useState("")
  const [generating, setGenerating] = useState(false)
  const [code, setCode] = useState("")

  const handleGenerate = () => {
    if (!prompt) return

    setGenerating(true)
    setCode("")

    // Simulate code generation
    setTimeout(() => {
      const codeExamples: Record<string, string> = {
        javascript: `// ${prompt}
function example() {
  const data = [1, 2, 3, 4, 5];
  const result = data.filter(item => item > 2)
                     .map(item => item * 2);
  console.log(result);
  return result;
}

// Call the function
example();`,
        python: `# ${prompt}
def example():
    data = [1, 2, 3, 4, 5]
    result = [item * 2 for item in data if item > 2]
    print(result)
    return result

# Call the function
example()`,
        java: `// ${prompt}
public class Example {
    public static void main(String[] args) {
        int[] data = {1, 2, 3, 4, 5};
        List<Integer> result = Arrays.stream(data)
                                    .filter(item -> item > 2)
                                    .map(item -> item * 2)
                                    .boxed()
                                    .collect(Collectors.toList());
        System.out.println(result);
    }
}`,
      }

      setCode(codeExamples[language] || codeExamples.javascript)
      setGenerating(false)
    }, 1500)
  }

  return (
    <div className="max-w-2xl mx-auto bg-zinc-800 rounded-lg overflow-hidden">
      <div className="p-4 border-b border-zinc-700">
        <h1 className="text-xl font-bold">Code Helper</h1>
        <p className="text-sm text-zinc-400">Get help with programming assignments</p>
      </div>

      <div className="p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Programming Language</label>
          <div className="flex space-x-2">
            {["javascript", "python", "java"].map((lang) => (
              <Button
                key={lang}
                type="button"
                variant={language === lang ? "default" : "outline"}
                className={language === lang ? "bg-emerald-600 hover:bg-emerald-700" : "border-zinc-700"}
                onClick={() => setLanguage(lang)}
              >
                {lang.charAt(0).toUpperCase() + lang.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">What do you need help with?</label>
          <Textarea
            placeholder="Describe the code you need help with..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full h-24 bg-zinc-700 border-zinc-600 resize-none"
          />
        </div>

        <Button
          className="w-full bg-emerald-600 hover:bg-emerald-700"
          disabled={!prompt || generating}
          onClick={handleGenerate}
        >
          {generating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Code...
            </>
          ) : (
            "Generate Code"
          )}
        </Button>

        {code && (
          <div className="mt-4">
            <label className="block text-sm font-medium mb-1">Generated Code</label>
            <div className="bg-zinc-900 p-4 rounded-lg">
              <pre className="text-sm text-zinc-100 whitespace-pre-wrap">{code}</pre>
            </div>
            <div className="flex justify-end mt-2">
              <Button
                variant="outline"
                className="border-zinc-700"
                onClick={() => {
                  navigator.clipboard.writeText(code)
                }}
              >
                Copy to Clipboard
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function MathSolver() {
  const [problem, setProblem] = useState("")
  const [solving, setSolving] = useState(false)
  const [solution, setSolution] = useState("")

  const handleSolve = () => {
    if (!problem) return

    setSolving(true)
    setSolution("")

    // Simulate solving
    setTimeout(() => {
      // Simple math problem solver (just for demonstration)
      let solutionText = `Problem: ${problem}\n\n`

      if (problem.includes("+") || problem.includes("-") || problem.includes("*") || problem.includes("/")) {
        try {
          const result = eval(problem)
          solutionText += `Step 1: Evaluate the expression ${problem}\n`
          solutionText += `Step 2: Apply the arithmetic operation\n`
          solutionText += `Solution: ${result}`
        } catch (error) {
          solutionText += "I couldn't solve this problem. Please check the format and try again."
        }
      } else if (problem.toLowerCase().includes("equation")) {
        solutionText += `Step 1: Identify the equation type\n`
        solutionText += `Step 2: Isolate the variable\n`
        solutionText += `Step 3: Solve for the variable\n`
        solutionText += `Solution: x = 5`
      } else {
        solutionText += `Step 1: Analyze the problem\n`
        solutionText += `Step 2: Apply relevant formulas\n`
        solutionText += `Step 3: Calculate the result\n`
        solutionText += `Solution: The answer is 42`
      }

      setSolution(solutionText)
      setSolving(false)
    }, 1500)
  }

  return (
    <div className="max-w-2xl mx-auto bg-zinc-800 rounded-lg overflow-hidden">
      <div className="p-4 border-b border-zinc-700">
        <h1 className="text-xl font-bold">Math Problem Solver</h1>
        <p className="text-sm text-zinc-400">Solve complex math problems with steps</p>
      </div>

      <div className="p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Math Problem</label>
          <Textarea
            placeholder="Enter your math problem (e.g., '2x + 5 = 15' or '3 * 4 + 2')"
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            className="w-full h-24 bg-zinc-700 border-zinc-600 resize-none"
          />
        </div>

        <Button
          className="w-full bg-emerald-600 hover:bg-emerald-700"
          disabled={!problem || solving}
          onClick={handleSolve}
        >
          {solving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Solving...
            </>
          ) : (
            "Solve Problem"
          )}
        </Button>

        {solution && (
          <div className="mt-4">
            <label className="block text-sm font-medium mb-1">Solution</label>
            <div className="bg-zinc-900 p-4 rounded-lg">
              <pre className="text-sm text-zinc-100 whitespace-pre-wrap">{solution}</pre>
            </div>
            <div className="flex justify-end mt-2">
              <Button
                variant="outline"
                className="border-zinc-700"
                onClick={() => {
                  navigator.clipboard.writeText(solution)
                }}
              >
                Copy to Clipboard
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
