"use client";

import Link from "next/link";
import { useState } from "react";
import { FiCheck, FiX } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  normalizeAnswer,
  type FillQuestion,
  type TrueFalseQuestion,
} from "@/lib/quiz";

type Props =
  | { mode: "fill"; deckId: number; questions: FillQuestion[] }
  | { mode: "tf"; deckId: number; questions: TrueFalseQuestion[] };

// Practice only: everything runs in the browser, nothing is saved.
export function Quiz(props: Props) {
  const [questions, setQuestions] = useState<(FillQuestion | TrueFalseQuestion)[]>(
    props.questions,
  );
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);
  const [score, setScore] = useState(0);
  const [wrong, setWrong] = useState<(FillQuestion | TrueFalseQuestion)[]>([]);

  const done = index >= questions.length;
  const question = questions[index];

  const submit = (isCorrect: boolean) => {
    setResult(isCorrect ? "correct" : "wrong");
    if (isCorrect) setScore((s) => s + 1);
    else setWrong((w) => [...w, question]);
  };

  const next = () => {
    setIndex((i) => i + 1);
    setText("");
    setResult(null);
  };

  const restart = (list: (FillQuestion | TrueFalseQuestion)[]) => {
    setQuestions(list);
    setIndex(0);
    setText("");
    setResult(null);
    setScore(0);
    setWrong([]);
  };

  if (done) {
    return (
      <Card>
        <CardContent className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold">Test bitti</h2>
          <p>
            {questions.length} sorudan <strong>{score}</strong> tanesini doğru
            yaptın.
          </p>
          {wrong.length > 0 && (
            <Button onClick={() => restart(wrong)}>
              Yanlışları tekrar et ({wrong.length})
            </Button>
          )}
          <Button variant="outline" onClick={() => restart(props.questions)}>
            Baştan başla
          </Button>
          <Button
            variant="ghost"
            nativeButton={false}
            render={<Link href={`/words/${props.deckId}`} />}
          >
            Desteye dön
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        Soru {index + 1}/{questions.length}
      </p>

      <Card>
        <CardContent className="flex flex-col gap-4">
          {props.mode === "fill" ? (
            <FillView
              question={question as FillQuestion}
              text={text}
              setText={setText}
              result={result}
              onCheck={() =>
                submit(
                  normalizeAnswer(text) ===
                    normalizeAnswer((question as FillQuestion).answer),
                )
              }
            />
          ) : (
            <TrueFalseView
              question={question as TrueFalseQuestion}
              result={result}
              onAnswer={(value) =>
                submit(value === (question as TrueFalseQuestion).isTrue)
              }
            />
          )}

          {result && (
            <Button onClick={next}>
              {index + 1 >= questions.length ? "Sonucu gör" : "Sonraki"}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function ResultBanner({
  result,
  children,
}: {
  result: "correct" | "wrong";
  children?: React.ReactNode;
}) {
  return (
    <div
      role="status"
      className={
        result === "correct"
          ? "flex items-start gap-2 rounded-md bg-green-500/10 p-3 text-sm text-green-700 dark:text-green-400"
          : "flex items-start gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive"
      }
    >
      {result === "correct" ? <FiCheck className="mt-0.5" /> : <FiX className="mt-0.5" />}
      <div>
        <p className="font-medium">{result === "correct" ? "Doğru!" : "Yanlış"}</p>
        {children}
      </div>
    </div>
  );
}

function FillView({
  question,
  text,
  setText,
  result,
  onCheck,
}: {
  question: FillQuestion;
  text: string;
  setText: (v: string) => void;
  result: "correct" | "wrong" | null;
  onCheck: () => void;
}) {
  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (!result && text.trim()) onCheck();
      }}
    >
      <p className="text-sm text-muted-foreground">İngilizcesini yaz:</p>
      <p className="text-2xl font-bold">{question.turkish}</p>
      {question.hint && (
        <p className="rounded-md bg-muted p-3 text-sm">{question.hint}</p>
      )}
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={result !== null}
        autoComplete="off"
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck={false}
        aria-label="Cevap"
        autoFocus
      />
      {result ? (
        <ResultBanner result={result}>
          {result === "wrong" && (
            <p>
              Doğru cevap: <strong>{question.answer}</strong>
            </p>
          )}
        </ResultBanner>
      ) : (
        <Button type="submit" disabled={!text.trim()}>
          Kontrol et
        </Button>
      )}
    </form>
  );
}

function TrueFalseView({
  question,
  result,
  onAnswer,
}: {
  question: TrueFalseQuestion;
  result: "correct" | "wrong" | null;
  onAnswer: (value: boolean) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">Bu eşleşme doğru mu?</p>
      <p className="text-2xl font-bold">{question.english}</p>
      <p className="text-xl">= {question.shownTurkish}</p>
      {result ? (
        <ResultBanner result={result}>
          {result === "wrong" && (
            <p>
              <strong>{question.english}</strong> = {question.correctTurkish}
            </p>
          )}
        </ResultBanner>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          <Button onClick={() => onAnswer(true)}>Doğru</Button>
          <Button variant="outline" onClick={() => onAnswer(false)}>
            Yanlış
          </Button>
        </div>
      )}
    </div>
  );
}
