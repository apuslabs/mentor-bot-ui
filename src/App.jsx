import React, { useState } from 'react';
import { useConnection, useActiveAddress } from '@arweave-wallet-kit/react';
import { message, createDataItemSigner } from '@permaweb/aoconnect';
import './App.css';

// Helper function to parse simple markdown-like text
const renderAnalysis = (text) => {
  if (!text) return null;
  // Replace **text** with <strong>text</strong> and render line by line
  return text.split('\n').map((line, index) => (
    <p key={index} dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
  ));
};

// Function to validate GitHub URL
const isValidGitHubUrl = (url) => {
  const githubUrlPattern = /^https:\/\/github\.com\/[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+\/?$/;
  return githubUrlPattern.test(url);
};

// 错误弹窗组件
const ErrorModal = ({ isOpen, message, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="error-modal-overlay" onClick={onClose}>
      <div className="error-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="error-modal-header">
          <h3>⚠️ 提示</h3>
          <button className="error-modal-close" onClick={onClose}>×</button>
        </div>
        <div className="error-modal-body">
          <p>{message}</p>
        </div>
        <div className="error-modal-footer">
          <button className="error-modal-button" onClick={onClose}>确定</button>
        </div>
      </div>
    </div>
  );
};

// Function to extract owner and repo from GitHub URL
const extractRepoInfo = (url) => {
  const match = url.match(/github\.com\/([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)/);
  if (match) {
    return {
      owner: match[1],
      repo: match[2]
    };
  }
  return null;
};

// Function to fetch README from GitHub raw content URL
const fetchReadme = async (owner, repo) => {
  const branches = ['main', 'master'];
  for (const branch of branches) {
    try {
      const url = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/README.md`;
      console.log(`Attempting to fetch README from: ${url}`);
      const response = await fetch(url);
      if (response.ok) {
        return await response.text();
      }
    } catch (error) {
      // Log error for the specific branch and continue to the next
      console.error(`Error fetching README from branch ${branch}:`, error);
    }
  }

  // If both branches fail
  console.error('Could not fetch README from common branches (main, master).');
  throw new Error('README not found in main or master branch');
};

function App() {
  const [repoUrl, setRepoUrl] = useState('');
  const [analysisResult, setAnalysisResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorModal, setErrorModal] = useState({ isOpen: false, message: '' });
  
  // Arweave wallet hooks
  const { connect, disconnect, connected } = useConnection();
  const activeAddress = useActiveAddress();

  // 显示错误弹窗的函数
  const showError = (message) => {
    setErrorModal({ isOpen: true, message });
  };

  // 关闭错误弹窗的函数
  const closeError = () => {
    setErrorModal({ isOpen: false, message: '' });
  };

  // Function to send message to AO process
  const sendToAO = async (data) => {
    if (!connected) {
      throw new Error('Wallet not connected');
    }

    try {
      const result = await message({
        process: "your-process-id", // 替换为实际的AO Process ID
        tags: [
          { name: "Action", value: "AnalyzeRepo" },
          { name: "RepoUrl", value: repoUrl },
        ],
        signer: createDataItemSigner(globalThis.arweaveWallet),
        data: JSON.stringify(data),
      });
      return result;
    } catch (error) {
      console.error('Error sending to AO:', error);
      throw error;
    }
  };

  const handleAnalyze = async () => {
    if (!repoUrl) {
      showError('请输入GitHub仓库URL');
      return;
    }

    // Validate GitHub URL
    if (!isValidGitHubUrl(repoUrl)) {
      showError('请输入有效的GitHub仓库URL\n\n格式示例: https://github.com/username/repository');
      return;
    }

    // 检查钱包连接状态
    if (!connected) {
      showError('请先连接钱包后再进行项目分析');
      return;
    }

    setIsLoading(true);
    
    try {
      // Extract repository information
      const repoInfo = extractRepoInfo(repoUrl);
      if (!repoInfo) {
        showError('无法解析仓库信息，请检查URL格式是否正确');
        setIsLoading(false);
        return;
      }

      // Fetch README
      const readmeContent = await fetchReadme(repoInfo.owner, repoInfo.repo);
      
      // Send to AO process (wallet is already connected)
      try {
        await sendToAO({
          repoUrl,
          repoInfo,
          readmeContent
        });
        console.log('Data sent to AO process successfully');
      } catch (error) {
        console.error('Failed to send to AO process:', error);
      }
      
      // Mock analysis with README content
      setTimeout(() => {
        const mockAnalysis = `
        正在分析仓库: ${repoUrl}
        仓库所有者: ${repoInfo.owner}
        仓库名称: ${repoInfo.repo}
        钱包地址: ${activeAddress}
        -----------------------------------
        
        **README 内容预览:**
        ${readmeContent ? readmeContent : '未找到README文件'}
        
        -----------------------------------
        **整体评分: 85/100**

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
        Verifiable Attestation Attached Here (Sent to AO Process)
      `;
        setAnalysisResult(mockAnalysis);
        setIsLoading(false);
      }, 3000);
    } catch (error) {
      showError('获取仓库信息时出错，请检查URL是否正确或网络连接是否正常');
      setIsLoading(false);
    }
  };

  const handleWalletAction = () => {
    if (connected) {
      disconnect();
    } else {
      connect();
    }
  };

  return (
    <div className="App">
      {/* 钱包按钮移到右上角 */}
      <button className="wallet-button-fixed" onClick={handleWalletAction}>
        {connected ? `${activeAddress?.slice(0, 6)}...${activeAddress?.slice(-4)}` : 'Connect Wallet'}
      </button>
      
      <div className="content-wrap">
        <header className="App-header">
          <h1>Autonomous Hackathon Judge</h1>
        </header>
        <main>
          <div className="input-section">
            <input
              type="text"
              value={repoUrl}
              onChange={(e) => {
                setRepoUrl(e.target.value);
              }}
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
      
      {/* 错误弹窗 */}
      <ErrorModal 
        isOpen={errorModal.isOpen} 
        message={errorModal.message} 
        onClose={closeError} 
      />
    </div>
  );
}

export default App;