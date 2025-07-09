import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../../components/resumeupload/BackButton";
import HeroSection from "../../components/resumeupload/HeroSection";
import SuccessMessage from "../../components/resumeupload/SuccessMessage";
import Tabs from "../../components/resumeupload/Tabs";
import {
  Upload,
  FileText,
  Eye,
  Download,
  Trash2,
  Check,
  Brain,
} from "lucide-react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setExtractedResumes } from "../../store/FeaturedResume/resume";

const ResumeUpload = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isDragging, setIsDragging] = useState(false);
  const [resumeFiles, setResumeFiles] = useState([]);
  const [jdFile, setJdFile] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [analysisStatus, setAnalysisStatus] = useState({});
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setIsPageLoaded(true);
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleResumeDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    handleResumeFiles([...e.dataTransfer.files]);
  }, []);

  const handleJDDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    handleJDFile([...e.dataTransfer.files]);
  }, []);

  const handleResumeFileInput = (e) => handleResumeFiles([...e.target.files]);
  const handleJDFileInput = (e) => handleJDFile([...e.target.files]);

  const handleJDFile = (newFile) => {
    const validFiles = newFile.filter((file) =>
      [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
      ].includes(file.type)
    );

    if (validFiles.length !== newFile.length) {
      alert("Only PDF, DOCX, or TXT files are supported.");
    }

    setJdFile((prev) => [...prev, ...validFiles]);
    validFiles.forEach((file) => {
      simulateFileUpload(file);
      simulateAIAnalysis(file);
    });
  };

  const handleResumeFiles = (newFiles) => {
    const validFiles = newFiles.filter((file) =>
      [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
      ].includes(file.type)
    );

    if (validFiles.length !== newFiles.length) {
      alert("Only PDF, DOCX, and TXT files are supported.");
    }

    setResumeFiles((prev) => [...prev, ...validFiles]);
    validFiles.forEach((file) => {
      simulateFileUpload(file);
      simulateAIAnalysis(file);
    });
  };

  const simulateFileUpload = (file) => {
    setUploadProgress((prev) => ({ ...prev, [file.name]: 0 }));
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        const newProgress = (prev[file.name] || 0) + 10;
        if (newProgress >= 100) clearInterval(interval);
        return { ...prev, [file.name]: Math.min(newProgress, 100) };
      });
    }, 500);
  };

  const simulateAIAnalysis = (file) => {
    setAnalysisStatus((prev) => ({ ...prev, [file.name]: "Scanning" }));
    setTimeout(() => {
      setAnalysisStatus((prev) => ({ ...prev, [file.name]: "Analyzing" }));
      setTimeout(() => {
        setAnalysisStatus((prev) => ({ ...prev, [file.name]: "Complete" }));
      }, 3000);
    }, 2000);
  };

  const removeFile = (fileName, fileType) => {
    if (fileType === "resume") {
      setResumeFiles((prev) => prev.filter((file) => file.name !== fileName));
    } else if (fileType === "jd") {
      setJdFile((prev) => prev.filter((file) => file.name !== fileName));
    }
    setUploadProgress((prev) => {
      const newProgress = { ...prev };
      delete newProgress[fileName];
      return newProgress;
    });
    setAnalysisStatus((prev) => {
      const newStatus = { ...prev };
      delete newStatus[fileName];
      return newStatus;
    });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');
    try {
      const formData = new FormData();
      // Append resume files
      resumeFiles.forEach((file) => formData.append("files", file));
      // Append JD file - since it's an array, take the first file
      if (jdFile.length > 0) {
        formData.append("jd", jdFile[0]);
      } else {
        throw new Error("Please upload a job description file");
      }

      const response = await axios.post("https://neohire-backend.onrender.com/api/extract-text", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      dispatch(setExtractedResumes(response.data.extracted_resumes));
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
        navigate("/job-matching");
      }, 3000);
    } catch (error) {
      console.error("Error uploading files:", error);
      setError(error.message || "Error uploading files");
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewFile = (file) => {
    const fileURL = URL.createObjectURL(file);
    window.open(fileURL, "_blank");
  };

  const handleDownloadFile = (file) => {
    const fileURL = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = fileURL;
    link.setAttribute("download", file.name);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div
      className={`min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 md:p-8 transition-all duration-500 ${
        isPageLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        <BackButton />
        <HeroSection />
        {showSuccessMessage && <SuccessMessage />}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
          <Tabs />
          <div className="flex justify-between items-baseline p-4 sm:p-6 md:p-8 bg-gray-100 dark:bg-gray-700">
            {/* Resume Upload Section */}
            <div className="w-1/2 pr-2">
              <div
                className={`
                    relative p-6 sm:p-8 md:p-12 mb-8 rounded-xl transition-all duration-300 transform
                    ${
                      isDragging
                        ? "bg-blue-50 dark:bg-blue-900/30 scale-102 border-2 border-blue-500 border-dashed"
                        : "bg-white/50 dark:bg-gray-800/50 shadow-lg hover:shadow-xl backdrop-blur-lg backdrop-filter"
                    }
                  `}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleResumeDrop}
              >
                <div className="text-center transform transition-all duration-300">
                  <Upload
                    className={`w-16 h-16 mx-auto mb-4 text-blue-500 transition-transform duration-300 ${
                      isDragging ? "scale-110" : ""
                    }`}
                  />
                  <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                    Drag & Drop Resumes Here
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Supports PDF, DOCX, and TXT formats
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <label className="inline-flex items-center px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0">
                      <Upload className="w-5 h-5 mr-2" />
                      Browse Files
                      <input
                        type="file"
                        className="hidden"
                        multiple
                        accept=".pdf,.doc,.docx,.txt"
                        onChange={handleResumeFileInput}
                      />
                    </label>
                  </div>
                </div>
              </div>
              {/* Uploaded Files List */}
              {resumeFiles.length > 0 && (
                <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl shadow-xl p-4 sm:p-6 transform transition-all duration-500 animate-fade-in-up backdrop-blur-lg backdrop-filter">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                    Uploaded Resumes File
                  </h3>
                  <div className="space-y-4">
                    {resumeFiles.map((file, index) => (
                      <div
                        key={file.name}
                        className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 transition-all duration-300 hover:shadow-md transform hover:-translate-y-0.5"
                        style={{
                          animationDelay: `${index * 100}ms`,
                        }}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-center space-x-4">
                            <FileText className="w-8 h-8 text-blue-500 flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="font-medium text-gray-900 dark:text-white truncate">
                                {file.name}
                              </p>
                              <div className="flex items-center space-x-2 flex-wrap">
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {uploadProgress[file.name] === 100 ? (
                                    <span className="flex items-center text-green-500">
                                      <Check className="w-4 h-4 mr-1" />{" "}
                                      Uploaded
                                    </span>
                                  ) : (
                                    `Uploading: ${uploadProgress[file.name]}%`
                                  )}
                                </div>
                                <div className="text-sm">
                                  {analysisStatus[file.name] && (
                                    <span
                                      className={`flex items-center ${
                                        analysisStatus[file.name] === "Complete"
                                          ? "text-green-500"
                                          : "text-blue-500"
                                      }`}
                                    >
                                      <Brain className="w-4 h-4 mr-1" />
                                      AI: {analysisStatus[file.name]}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600"
                              onClick={() => handleViewFile(file)}
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                            <button
                              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600"
                              onClick={() => handleDownloadFile(file)}
                            >
                              <Download className="w-5 h-5" />
                            </button>
                            <button
                              className="p-2 text-red-500 hover:text-red-700 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                              onClick={() => removeFile(file.name, "resume")}
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-4">
                          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-blue-500 h-2 rounded-full transition-all duration-300 ease-out"
                              style={{
                                width: `${uploadProgress[file.name]}%`,
                                transition: "width 0.5s ease-out",
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Job Description Section */}
            <div className="w-1/2 pl-2 space-y-6">
              <div
                className={`
                    relative p-6 sm:p-8 md:p-12 mb-8 rounded-xl transition-all duration-300 transform
                    ${
                      isDragging
                        ? "bg-blue-50 dark:bg-blue-900/30 scale-102 border-2 border-blue-500 border-dashed"
                        : "bg-white/50 dark:bg-gray-800/50 shadow-lg hover:shadow-xl backdrop-blur-lg backdrop-filter"
                    }
                  `}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleJDDrop}
              >
                <div className="text-center transform transition-all duration-300">
                  <Upload
                    className={`w-16 h-16 mx-auto mb-4 text-purple-600 transition-transform duration-300 ${
                      isDragging ? "scale-110" : ""
                    }`}
                  />
                  <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                    Drag & Drop Job Description Here
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Supports PDF, DOCX, and TXT formats
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <label className="inline-flex items-center px-6 py-3 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-all duration-200 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0">
                      <Upload className="w-5 h-5 mr-2" />
                      Upload JD
                      <input
                        type="file"
                        className="hidden"
                        multiple
                        accept=".pdf,.doc,.docx,.txt"
                        onChange={handleJDFileInput}
                      />
                    </label>
                  </div>
                </div>
              </div>
              {/* Uploaded Files List */}
              {jdFile.length > 0 && (
                <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl shadow-xl p-4 sm:p-6 transform transition-all duration-500 animate-fade-in-up backdrop-blur-lg backdrop-filter">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                    Job Description File
                  </h3>
                  <div className="space-y-4">
                    {jdFile.map((file, index) => (
                      <div
                        key={file.name}
                        className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 transition-all duration-300 hover:shadow-md transform hover:-translate-y-0.5"
                        style={{
                          animationDelay: `${index * 100}ms`,
                        }}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-center space-x-4">
                            <FileText className="w-8 h-8 text-blue-500 flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="font-medium text-gray-900 dark:text-white truncate">
                                {file.name}
                              </p>
                              <div className="flex items-center space-x-2 flex-wrap">
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {uploadProgress[file.name] === 100 ? (
                                    <span className="flex items-center text-green-500">
                                      <Check className="w-4 h-4 mr-1" />{" "}
                                      Uploaded
                                    </span>
                                  ) : (
                                    `Uploading: ${uploadProgress[file.name]}%`
                                  )}
                                </div>
                                <div className="text-sm">
                                  {analysisStatus[file.name] && (
                                    <span
                                      className={`flex items-center ${
                                        analysisStatus[file.name] === "Complete"
                                          ? "text-green-500"
                                          : "text-blue-500"
                                      }`}
                                    >
                                      <Brain className="w-4 h-4 mr-1" />
                                      AI: {analysisStatus[file.name]}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600"
                              onClick={() => handleViewFile(file)}
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                            <button
                              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600"
                              onClick={() => handleDownloadFile(file)}
                            >
                              <Download className="w-5 h-5" />
                            </button>
                            <button
                              className="p-2 text-red-500 hover:text-red-700 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                              onClick={() => removeFile(file.name, "jd")}
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-4">
                          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-blue-500 h-2 rounded-full transition-all duration-300 ease-out"
                              style={{
                                width: `${uploadProgress[jdFile.name]}%`,
                                transition: "width 0.5s ease-out",
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="px-4 sm:px-6 md:px-8 py-4 bg-gray-100 dark:bg-gray-700">
            <button
              onClick={handleSubmit}
              disabled={
                resumeFiles.length === 0 && jdFile.length === 0 || isLoading
              }
              className={`
                mx-auto block px-8 py-3 
                w-1/4 rounded-lg transition-all duration-200 
                transform hover:-translate-y-0.5 active:translate-y-0 
                text-white font-semibold text-lg
                ${
                  resumeFiles.length === 0 && jdFile.length === 0
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 opacity-50 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600 shadow-lg hover:shadow-xl"
                }
              `}
            >
               {isLoading ? 'Analyzing...' : 'Submit Files'}
            </button>
          </div>
          {error && (
            <p className="mt-2 text-center text-red-500 font-medium">{error}</p>
          )}

          {/* Blockchain Explanation Section */}
          <div className="p-4 sm:p-6 md:p-8 bg-gray-100 dark:bg-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              How Blockchain Redefines Credential Verification and Data Security
            </h2>
            <div className="w-full space-y-8 bg-white/50 dark:bg-gray-800/50 rounded-xl p-6 backdrop-blur-lg backdrop-filter">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  1. Verification That Builds Trust
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  When resumes or job descriptions (JDs) are uploaded, they are
                  transformed into unique, tamper-proof digital signatures
                  called cryptographic hashes. These hashes are compared with
                  verified records stored securely on the blockchain. If the
                  records match, the credentials are authenticated seamlessly.
                  No match? The system flags discrepancies instantly—ensuring
                  accuracy and trust.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  2. Your Data, Your Authority
                </h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                  <li>
                    <span className="font-semibold">Complete Ownership:</span>{" "}
                    You maintain absolute control over your data. With private
                    key authorization, only you decide who can access your
                    credentials.
                  </li>
                  <li>
                    <span className="font-semibold">Role-Based Access:</span>{" "}
                    Employers and HR professionals are granted permissions
                    tailored to their needs, ensuring privacy and limiting
                    overreach.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  3. Cutting-Edge Security You Can Rely On
                </h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                  <li>
                    <span className="font-semibold">
                      Decentralized Privacy:
                    </span>{" "}
                    Blockchain ensures sensitive data like resumes and
                    certificates are never stored directly on-chain. Instead,
                    the information is securely encrypted and stored on
                    decentralized storage solutions (e.g., IPFS), and only
                    references (hashes) are linked to the blockchain.
                  </li>
                  <li>
                    <span className="font-semibold">
                      Tamper-Proof Technology:
                    </span>{" "}
                    Data recorded on the blockchain is immutable—it cannot be
                    altered, deleted, or compromised. This guarantees the
                    integrity of your credentials.
                  </li>
                  <li>
                    <span className="font-semibold">
                      Bank-Grade Encryption:
                    </span>{" "}
                    Advanced encryption algorithms shield your data at every
                    step of the process, safeguarding against unauthorized
                    access and cyber threats.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  4. Transparency at Its Core
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Every transaction—be it credential verification, access
                  request, or audit log—is tracked on an immutable ledger. This
                  transparent record is accessible to authorized parties,
                  ensuring accountability without compromising privacy.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Why It Matters
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Blockchain doesn't just verify your credentials—it elevates
                  them to a standard of integrity, transparency, and security.
                  By empowering candidates with full control over their data and
                  protecting it with advanced technologies, it reimagines the
                  hiring process for a modern, digital world.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeUpload;
