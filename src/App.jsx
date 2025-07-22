import React, { useState } from 'react';
import './App.css';

// Helper function to parse simple markdown-like text
const renderAnalysis = (text) => {
  if (!text) return null;
  // Replace **text** with <strong>text</strong> and render line by line
  return text.split('\n').map((line, index) => (
    <p key={index} dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
  ));
};

function App() {
  const [repoUrl, setRepoUrl] = useState('');
  const [analysisResult, setAnalysisResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = () => {
    if (!repoUrl) {
      alert('Please enter a repository URL.');
      return;
    }
    setIsLoading(true);
    // Mock analysis
    setTimeout(() => {
      const mockAnalysis = `
        Analyzing repository: ${repoUrl}
        -----------------------------------
        **Overall Score: 85/100**

        **Breakdown:**
        - **Practical Utility (30%):** 25/30
        - **Technical Implementation (25%):** 22/25
        - **Autonomy (20%):** 15/20
        - **User Experience (15%):** 13/15
        - **Innovation (10%):** 10/10

        **Suggestions for Improvement:**
        1.  **Documentation:** Consider adding a more detailed "Getting Started" guide.
        2.  **Code Quality:** Some functions in 'src/utils.js' could be refactored for better readability.
        3.  **Testing:** Increase test coverage for critical components.
        -----------------------------------
        Verfiable Attestation Attached Here
      `;
      setAnalysisResult(mockAnalysis);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="App">
      <div className="content-wrap">
        <header className="App-header">
          <h1>Autonomous Hackathon Judge</h1>
        </header>
        <main>
          <div className="input-section">
            <input
              type="text"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="Enter GitHub Repository URL"
            />
            <button onClick={handleAnalyze} disabled={isLoading}>
              {isLoading ? 'Analyzing...' : 'Analyze Project'}
            </button>
          </div>
          {analysisResult && (
            <div className="results-section">
              <h2>Analysis Report</h2>
              <div>{renderAnalysis(analysisResult)}</div>
            </div>
          )}
        </main>
      </div>
      <footer className="powered-by">
        <p>Powered by Apus Network</p>
      </footer>
    </div>
  );
}

export default App;