import React, { useEffect, useRef } from "react";
import "codemirror/lib/codemirror.css";
import CodeMirror from "codemirror";
import axios from "axios";
import { ACTIONS } from "../Actions";

// Import the modes for different languages
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/python/python";
import "codemirror/mode/clike/clike"; // C, C++, Java, C#
import "codemirror/mode/ruby/ruby";
import "codemirror/mode/go/go";
import "codemirror/mode/sql/sql";
import "codemirror/mode/bash/bash";
import "codemirror/mode/scala/scala";
import "codemirror/mode/php/php";
import "codemirror/mode/swift/swift";
import "codemirror/mode/rust/rust";
import "codemirror/mode/markdown/markdown";
import "codemirror/mode/pascal/pascal";
import "codemirror/mode/javascript/javascript"; // JavaScript
import "codemirror/mode/r/r";
import "codemirror/theme/dracula.css"; // Theme import

// Import hint add-ons
import "codemirror/addon/hint/show-hint";
import "codemirror/addon/hint/javascript-hint"; // For JavaScript hints
import "codemirror/addon/hint/python-hint"; // For Python hints
import "codemirror/addon/hint/sql-hint"; // For SQL hints
// Add additional hint imports as needed

// Language configurations
const LANGUAGES = [
  "python3",
  "java",
  "cpp",
  "nodejs",
  "c",
  "ruby",
  "go",
  "scala",
  "bash",
  "sql",
  "pascal",
  "csharp",
  "php",
  "swift",
  "rust",
  "r",
];

function Editor({ socketRef, roomId, onCodeChange }) {
  const editorRef = useRef(null);

  // Function to fetch code completion
  const getCodeCompletion = async (prompt) => {
    // Fetch code completion from OpenAI API
  };

  useEffect(() => {
    const editor = CodeMirror.fromTextArea(
      document.getElementById("realtimeEditor"),
      {
        mode: { name: "javascript", json: true }, // Default mode
        theme: "dracula",
        autoCloseTags: true,
        autoCloseBrackets: true,
        lineNumbers: true,
        extraKeys: {
          "Ctrl-Space": async function (cm) {
            const cursor = cm.getCursor();
            const code = cm.getValue();
            const prompt = code.substring(0, cm.indexFromPos(cursor));
            const completion = await getCodeCompletion(prompt);
            if (completion) {
              cm.replaceRange(completion, cursor);
            }
          },
        },
      }
    );

    editorRef.current = editor;
    editor.setSize(null, "100%");

    // Listen to changes and emit code updates
    editor.on("change", (instance, changes) => {
      const { origin } = changes;
      const code = instance.getValue();
      onCodeChange(code);

      if (origin !== "setValue") {
        socketRef.current.emit(ACTIONS.CODE_CHANGE, {
          roomId,
          code,
        });
      }
    });
  }, [onCodeChange, roomId, socketRef]);

  return (
    <div style={{ height: "600px" }}>
      <textarea id="realtimeEditor"></textarea>
    </div>
  );
}

export default Editor;
