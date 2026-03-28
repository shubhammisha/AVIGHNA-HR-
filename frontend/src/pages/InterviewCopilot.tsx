import { useState } from 'react';
import { Mic, MicOff, AlertCircle, CheckCircle2, ListChecks } from 'lucide-react';
import './InterviewCopilot.css';

const InterviewCopilot = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState<string[]>([]);
  const [mustAsk] = useState([
    { id: 1, text: "Can you explain your experience with Distributed Systems?", asked: true },
    { id: 2, text: "How do you handle conflict in a team?", asked: false },
    { id: 3, text: "What is your approach to system design?", asked: false },
  ]);

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Simulate live transcription
      setTranscript(prev => [...prev, "Interviewer: Let's start the interview..."]);
    }
  };

  return (
    <div className="interview-copilot-container">
      <div className="main-panel">
        <div className="recording-status premium-card glassmorphism">
          <div className="status-header">
            <div className={`record-indicator ${isRecording ? 'active' : ''}`}></div>
            <span>{isRecording ? 'Recording Live Interview...' : 'Ready to Start'}</span>
          </div>
          <button className={`record-btn ${isRecording ? 'active' : ''}`} onClick={toggleRecording}>
            {isRecording ? <MicOff size={24} /> : <Mic size={24} />}
            {isRecording ? 'Stop Recording' : 'Start Recording'}
          </button>
        </div>

        <div className="transcript-box premium-card">
          <h3>Live Transcript</h3>
          <div className="transcript-content">
            {transcript.map((line, i) => (
              <p key={i}>{line}</p>
            ))}
            {isRecording && <p className="typing">Candidate is speaking...</p>}
          </div>
        </div>
      </div>

      <div className="side-panel">
        <div className="must-ask-card premium-card">
          <div className="card-header">
            <ListChecks size={20} className="icon-blue" />
            <h3>Must-Ask Checklist</h3>
          </div>
          <ul className="checklist">
            {mustAsk.map((q: any) => (
              <li key={q.id} className={q.asked ? 'asked' : 'missed'}>
                {q.asked ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                <span>{q.text}</span>
              </li>
            ))}
          </ul>
          {!mustAsk.every((q: any) => q.asked) && isRecording && (
            <div className="alert glassmorphism">
              <AlertCircle size={18} />
              <span>Warning: 2 mandatory questions remaining!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterviewCopilot;
