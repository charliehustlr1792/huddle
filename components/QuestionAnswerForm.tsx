import Item from "@/items/Item";
import { X, CheckCircle, XCircle } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Root } from "react-dom/client";
import axios from "axios";
import Image from "next/image";
import { getGameInstance } from "./PhaserGame";

interface Question {
  id: number;
  question: string | any[];
  type?: 'text' | 'image' | 'audio' | 'file';
  media?: string;
  shift?: number;
  case_sensitive?: boolean;
}

export default function QuestionAnswerForm({
  position,
  root,
  item,
  questionId,
  isPrelimsQuestion = false,
  shift = 1, // Default to shift 1
  questionLevel = 1
}: {
  position: { x: number; y: number };
  root: Root;
  item: Item;
  questionId: number;
  isPrelimsQuestion?: boolean;
  shift?: number;
  questionLevel?: number;
}) {
  const { x, y } = position;
  const [answer, setAnswer] = useState("");
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ success: boolean, msg: string } | null>(null);
  const [animation, setAnimation] = useState<'none' | 'success' | 'error'>('none');

  useEffect(() => {
    // Request only the specific question from the secure API endpoint
    axios.get(`/api/get-question?id=${questionId}&isPrelims=${isPrelimsQuestion}&shift=${shift}`)
      .then(response => {
        const foundQuestion = response.data.question;

        if (foundQuestion) {
          setQuestion(foundQuestion);
        } else {
          console.error(`Question with ID ${questionId} not found or not available in this shift`);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error("Error loading question:", error);
        setLoading(false);
      });

      if(questionId==2 && isPrelimsQuestion==false){
        axios.get('/api/secret-url').catch(err => {
          console.error('Error fetching Secret URL:', err);
        });
      }
  }, [questionId, isPrelimsQuestion, shift, questionLevel]);

  const playSoundEffect=(success:boolean)=>{
    const game=getGameInstance();
    if(game){
      const soundkey=success?'correct':'wrong'
      const scene=game.scene.getScene('game');
      if(scene && scene.sound)
        scene.sound.play(soundkey)
    }
  }

  const handleClose = () => {
    root.unmount();
    item.formOpen = false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question || submitting) return;

    setSubmitting(true); // Disable submit button

    try {
      const { data: result } = await axios.post('/api/verify-answer', {
        answer,
        questionId,
        isPrelimsQuestion,
        shift
      });

      setResult(result);
      playSoundEffect(result.success)
      if (result.success) {
        setAnimation('success');
        setTimeout(() => {
          root.unmount();
          item.formOpen = false;
          item.setCompleted(true); // This should trigger the callback
        }, 2000);
      } else {
        setAnimation('error');
        setTimeout(() => {
          setAnimation('none');
          setSubmitting(false); // Re-enable submit button for incorrect answers
        }, 2000);
      }
    } catch (error) {
      console.error("Submission error:", error);
      setResult({ success: false, msg: "Failed to verify answer. Please try again." });
      setAnimation('error');
      setTimeout(() => {
        setAnimation('none');
        setSubmitting(false); // Re-enable submit button after error
      }, 2000);
    }
  };

  const renderQuestion = () => {
    if (!question || !question.question) return null;

    // Handle array-based questions (like emoji grid)
    if (Array.isArray(question.question)) {
      return (
        <div className="grid grid-cols-8 mb-2">
          {question.question.map((row: any[], rowIndex: number) => (
            <React.Fragment key={`row-${rowIndex}`}>
              {row.map((cell: any, cellIndex: number) => (
                <div key={`cell-${rowIndex}-${cellIndex}`} className="text-center">
                  {cell}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      );
    }
    if (typeof question.question === 'string' && question.question.includes('\n')) {
      return (
        <div className="text-center text-lg">
          {question.question.split('\n').map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
      );
    }
    return <p className="text-center text-lg">{question.question}</p>;
  };

  const renderMedia = () => {
    if (!question || !question.type || question.type === 'text') return null;

    switch (question.type) {
      case 'image':
        if (question.media){
          if(question.id==4)
            return <Image src={question.media} alt="Question" className="max-w-full h-auto mb-4" width={512} height={512} unoptimized={true}/>;
          else
          return <Image src={question.media} alt="Question" className="max-w-full h-auto mb-4" width={300} height={200} unoptimized={true}/>;
        }
      case 'audio':
        return (
          <audio controls className="mb-4">
            <source src={question.media} />
            Your browser does not support the audio element.
          </audio>
        );
      case 'file':
        return <a href={question.media} download="cypher3331.mp4" className="text-blue-600 underline mb-4 block">Download File</a>;
      default:
        return null;
    }
  };

  return (
    <div
      className={`z-50 bg-white absolute flex flex-col items-center gap-y-4 max-h-[80vh] w-[50vw] rounded-lg p-6 text-black shadow-lg transition-all duration-300 overflow-y-auto ${animation === 'success' ? 'border-4 border-green-500' :
          animation === 'error' ? 'border-4 border-red-500 shake-animation' : ''
        }`}
      style={{ left: x, top: y, transform: 'translate(-50%, -50%)' }}
    >
      {loading ? (
        <div className="flex flex-col items-center justify-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4">Loading question...</p>
        </div>
      ) : question ? (
        <>
          <h2 className="text-2xl font-semibold">Question</h2>
          <div className="text-sm text-gray-600 mt-1 mb-3">
            Level {questionLevel} of 4
          </div>
          {renderMedia()}
          {renderQuestion()}

          <form className="flex flex-col gap-y-3 w-full max-w-md" onSubmit={handleSubmit}>
            <input
              type="text"
              className="border border-gray-300 p-2 rounded-md"
              placeholder="Enter your answer here"
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              disabled={animation === 'success' || submitting}
            />
            <button
              type="submit"
              className={`p-2 rounded-md text-white font-medium ${
                submitting ? 'bg-gray-400 cursor-not-allowed' :
                animation === 'success' ? 'bg-green-500' : 'bg-blue-600 hover:bg-blue-700'
              }`}
              disabled={animation === 'success' || submitting}
            >
              {submitting ? 'Submitting...' : 'Submit'}
            </button>
          </form>

          {result && (
            <div className={`flex items-center mt-2 ${result.success ? 'text-green-600' : 'text-red-600'}`}>
              {result.success ? (
                <CheckCircle className="mr-2" size={20} />
              ) : (
                <XCircle className="mr-2" size={20} />
              )}
              {result.msg}
            </div>
          )}
        </>
      ) : (
        <p>Question not found or not available in this shift.</p>
      )}

      <button
        className="text-black cursor-pointer absolute top-4 right-4 hover:text-gray-600"
        onClick={handleClose}
      >
        <X size={24} />
      </button>

      <style jsx>{`
        .shake-animation {
          animation: shake 0.5s;
        }
        
        @keyframes shake {
          0% { transform: translate(-50%, -50%) translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translate(-50%, -50%) translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translate(-50%, -50%) translateX(5px); }
          100% { transform: translate(-50%, -50%) translateX(0); }
        }
      `}</style>
    </div>
  );
}