import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import './CodePlayground.css';

const CodePlayground = ({ initialCode = '', language = 'javascript', onCodeChange }) => {
  const { t } = useTranslation(['common']);
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (onCodeChange) {
      onCodeChange(code);
    }
  }, [code, onCodeChange]);

  const handleRun = () => {
    setError('');
    setOutput('');
    
    try {
      // For JavaScript, we can use eval (with caution) or a safer approach
      if (language === 'javascript') {
        // Capture console.log output
        const logs = [];
        const originalLog = console.log;
        console.log = (...args) => {
          logs.push(args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
          ).join(' '));
        };

        try {
          eval(code);
          setOutput(logs.join('\n') || 'Code executed successfully (no output)');
        } catch (e) {
          setError(e.message);
        } finally {
          console.log = originalLog;
        }
      } else {
        setOutput('Code execution is currently only supported for JavaScript');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleClear = () => {
    setCode('');
    setOutput('');
    setError('');
  };

  return (
    <div className="code-playground">
      <div className="playground-header">
        <h3 className="playground-title">Code Playground</h3>
        <div className="playground-actions">
          <button className="playground-button run-button" onClick={handleRun}>
            ▶️ Run
          </button>
          <button className="playground-button clear-button" onClick={handleClear}>
            🗑️ Clear
          </button>
        </div>
      </div>

      <div className="playground-editor">
        <textarea
          className="code-input"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder={`// Write your ${language} code here...\nconsole.log("Hello, World!");`}
          spellCheck={false}
        />
      </div>

      {(output || error) && (
        <motion.div
          className={`playground-output ${error ? 'error' : ''}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="output-header">
            <span className="output-label">{error ? 'Error' : 'Output'}</span>
          </div>
          <pre className="output-content">{error || output}</pre>
        </motion.div>
      )}

      <div className="playground-info">
        <p className="info-text">
          💡 Tip: Use <code>console.log()</code> to see output. This playground runs JavaScript code.
        </p>
      </div>
    </div>
  );
};

export default CodePlayground;
