// src/components/RightPane/CodeEditor.js
import React from 'react'; // Removed useState
import Editor from '@monaco-editor/react';
import styles from './CodeEditor.module.css';
// Removed unused icons

// ✅ 1. Accept props from ProblemPage
function CodeEditor({ code, onCodeChange, language, onLanguageChange }) {
  
  // ✅ 2. Local state and handler are removed. They now live in ProblemPage.
  // const [code, setCode] = useState(...);
  // const handleEditorChange = (value) => { ... };

  return (
    <div className={styles.container}>
      {/* Editor Header */}
      <div className={styles.header}>
        <div className={styles.controls}>
          {/* ✅ 3. Control the select's value and onChange */}
          <select 
            className={styles.languageSelect}
            value={language}
            onChange={(e) => onLanguageChange(e.target.value)}
          >
            <option value="java">Java</option>
            <option value="python">Python3</option>
            <option value="cpp">C++</option>
            <option value="javascript">JavaScript</option>
          </select>
          <span className={styles.autoText}>Auto</span>
        </div>
      </div>

      {/* Monaco Code Editor */}
      <div className={styles.editor}>
        <Editor
          height="100%"
          language={language} // Use language prop
          // ✅ 4. Use `value` prop instead of `defaultValue` for a controlled component
          value={code} 
          theme="vs-dark"
          // ✅ 5. Use the handler from props
          onChange={onCodeChange}
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            lineNumbers: 'on',
            wordWrap: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      </div>

      {/* Editor Footer */}
      <div className={styles.footer}>
        <span>Ln 1, Col 1</span>
      </div>
    </div>
  );
}

export default CodeEditor;