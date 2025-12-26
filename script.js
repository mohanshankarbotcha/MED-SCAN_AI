
    // DOM elements
    const fileInput = document.getElementById("fileInput");
    const dropZone = document.getElementById("dropZone");
    const fileMeta = document.getElementById("fileMeta");
    const analyzeBtn = document.getElementById("analyzeBtn");
    const statusBar = document.getElementById("statusBar");
    const statusText = document.getElementById("statusText");
    const mockStatus = document.getElementById("mockStatus");
    const mockScore = document.getElementById("mockScore");

    const heroUploadBtn = document.getElementById("heroUploadBtn");
    const navUploadBtn = document.getElementById("navUploadBtn");
    const scrollToResultsBtn = document.getElementById("scrollToResults");

    // Result elements
    const diseaseNameEl = document.getElementById("diseaseName");
    const diseaseDetailsEl = document.getElementById("diseaseDetails");
    const diseaseTagEl = document.getElementById("diseaseTag");

    const severityPillEl = document.getElementById("severityPill");
    const severityLabelEl = document.getElementById("severityLabel");
    const severityExplanationEl = document.getElementById("severityExplanation");

    const explanationTextEl = document.getElementById("explanationText");
    const treatmentTextEl = document.getElementById("treatmentText");
    const billRangeEl = document.getElementById("billRange");
    const billExplanationEl = document.getElementById("billExplanation");
    const notesTextEl = document.getElementById("notesText");

    const summaryStatusEl = document.getElementById("summaryStatus");
    const summaryConditionEl = document.getElementById("summaryCondition");
    const summaryRiskEl = document.getElementById("summaryRisk");
    const summaryBillEl = document.getElementById("summaryBill");
    const resultsHintEl = document.getElementById("resultsHint");

    const yearSpan = document.getElementById("year");
    yearSpan.textContent = new Date().getFullYear();

    let selectedFile = null;

    // Smooth scroll helpers
    function scrollToElement(elemId) {
      const el = document.getElementById(elemId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }

    heroUploadBtn.addEventListener("click", () => {
      scrollToElement("upload");
      fileInput.click();
    });

    navUploadBtn.addEventListener("click", () => {
      scrollToElement("upload");
      fileInput.click();
    });

    scrollToResultsBtn.addEventListener("click", () => {
      scrollToElement("results");
    });

    // Drop zone behavior
    function setStatus(state, message) {
      statusBar.dataset.state = state;
      statusText.textContent = message;
    }

    function resetResults() {
      diseaseNameEl.textContent = "Upload a report to begin.";
      diseaseDetailsEl.textContent =
        "The system looks for disease-related keywords and simple numeric patterns to infer a possible condition for demonstration purposes only.";
      diseaseTagEl.textContent = "No data";

      severityLabelEl.textContent = "Not evaluated";
      severityExplanationEl.textContent =
        "Risk level is estimated from rough thresholds in your report text and should never be used as a real medical decision tool.";
      severityPillEl.className = "severity-pill severity-low";

      explanationTextEl.textContent =
        "Here you will see a friendly explanation of how the detected condition typically develops in the body, what common risk factors look like, and what routine monitoring may involve.";

      treatmentTextEl.textContent =
        "After analysis, this section suggests generic lifestyle ideas and follow-up checks to discuss with a real doctor, such as diet, activity, and routine lab tracking.";

      billRangeEl.textContent = "₹0 – ₹0";
      billExplanationEl.textContent =
        "The bill range is generated from the detected condition and severity and is meant only as a technical demonstration, not a real pricing reference.";

      notesTextEl.textContent =
        "When available, MediScan AI lists key terms it detected in your report, helping you understand what drove the demo prediction and risk score.";

      summaryStatusEl.textContent = "No report analyzed yet.";
      summaryConditionEl.textContent = "–";
      summaryRiskEl.textContent = "–";
      summaryBillEl.textContent = "–";

      mockStatus.textContent = "Idle";
      mockScore.textContent = "–";
      resultsHintEl.style.opacity = "1";
    }

    resetResults();

    function handleFileSelection(file) {
      if (!file) return;

      const allowedTypes = [
        "application/pdf",
        "text/plain",
        "image/jpeg",
        "image/png",
        "image/jpg"
      ];

      const ext = file.name.split(".").pop().toLowerCase();
      const allowedExts = ["pdf", "txt", "jpg", "jpeg", "png"];

      if (!allowedTypes.includes(file.type) && !allowedExts.includes(ext)) {
        selectedFile = null;
        fileMeta.innerHTML = '<i class="fa-regular fa-file-xmark"></i><span>Unsupported file type. Please use PDF, TXT, JPG or PNG.</span>';
        setStatus("error", "Unsupported file format.");
        return;
      }

      selectedFile = file;
      const sizeKB = Math.round(file.size / 1024);
      fileMeta.innerHTML = `
        <span class="file-pill">
          <i class="fa-regular fa-file-lines"></i>
          ${file.name}
        </span>
        <span>· ${sizeKB} KB</span>
      `;
      setStatus("idle", "File ready. Click 'Analyze report' to start demo analysis.");
    }

    dropZone.addEventListener("click", () => {
      fileInput.click();
    });

    dropZone.addEventListener("dragover", (e) => {
      e.preventDefault();
      dropZone.classList.add("drag-over");
    });

    dropZone.addEventListener("dragleave", () => {
      dropZone.classList.remove("drag-over");
    });

    dropZone.addEventListener("drop", (e) => {
      e.preventDefault();
      dropZone.classList.remove("drag-over");
      const file = e.dataTransfer.files[0];
      handleFileSelection(file);
    });

    fileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      handleFileSelection(file);
    });

    // Mock AI logic
    function parseReportText(text) {
      const lowercase = text.toLowerCase();

      const foundKeywords = [];

      const hasDiabetesKeywords =
        lowercase.includes("glucose") ||
        lowercase.includes("hba1c") ||
        lowercase.includes("fasting sugar") ||
        lowercase.includes("postprandial");

      if (hasDiabetesKeywords) foundKeywords.push("diabetes-related");

      const hasBpKeywords =
        lowercase.includes("bp") ||
        lowercase.includes("blood pressure") ||
        lowercase.includes("hypertension") ||
        lowercase.includes("systolic") ||
        lowercase.includes("diastolic");

      if (hasBpKeywords) foundKeywords.push("blood-pressure-related");

      const hasCholKeywords =
        lowercase.includes("cholesterol") ||
        lowercase.includes("ldl") ||
        lowercase.includes("hdl") ||
        lowercase.includes("triglyceride");

      if (hasCholKeywords) foundKeywords.push("cholesterol-related");

      const hasKidneyKeywords =
        lowercase.includes("creatinine") ||
        lowercase.includes("urea") ||
        lowercase.includes("egfr");

      if (hasKidneyKeywords) foundKeywords.push("kidney-function-related");

      // Extract simple numeric patterns, e.g., "glucose: 160" or "HbA1c 7.5%"
      const numericMatches = text.match(
        /(glucose|hba1c|cholesterol|ldl|hdl|triglycerides?|bp|blood pressure|systolic|diastolic)\D{0,10}(\d+(\.\d+)?)/gi
      );

      const metrics = [];
      if (numericMatches) {
        numericMatches.forEach((match) => {
          const m = match.match(/(glucose|hba1c|cholesterol|ldl|hdl|triglycerides?|bp|blood pressure|systolic|diastolic)\D{0,10}(\d+(\.\d+)?)/i);
          if (m) {
            metrics.push({
              name: m[1],
              value: parseFloat(m[2])
            });
          }
        });
      }

      // Decide primary condition (very simplified)
      let condition = "No obvious condition detected";
      let riskLevel = "Low";
      let riskScore = 10;

      if (hasDiabetesKeywords && !hasBpKeywords && !hasCholKeywords) {
        condition = "Possible Diabetes / High Blood Sugar";
      } else if (hasBpKeywords && !hasCholKeywords && !hasDiabetesKeywords) {
        condition = "Possible High Blood Pressure (Hypertension)";
      } else if (hasCholKeywords && !hasDiabetesKeywords && !hasBpKeywords) {
        condition = "Possible Elevated Cholesterol / Heart Risk";
      } else if (hasDiabetesKeywords && hasCholKeywords) {
        condition = "Metabolic risk (Blood sugar & Cholesterol)";
      } else if (hasDiabetesKeywords && hasBpKeywords) {
        condition = "Cardio-metabolic risk (BP & Sugar)";
      } else if (hasCholKeywords && hasBpKeywords) {
        condition = "Cardiovascular risk (BP & Cholesterol)";
      } else if (hasKidneyKeywords) {
        condition = "Possible Kidney Function Changes";
      }

      // Adjust riskScore with crude rules based on extracted values
      metrics.forEach((m) => {
        const label = m.name.toLowerCase();
        const v = m.value;
        if (label.includes("glucose")) {
          if (v >= 200) riskScore += 50;
          else if (v >= 140) riskScore += 35;
          else if (v >= 110) riskScore += 20;
        }
        if (label.includes("cholesterol")) {
          if (v >= 260) riskScore += 45;
          else if (v >= 220) riskScore += 30;
          else if (v >= 200) riskScore += 15;
        }
        if (label.includes("bp") || label.includes("blood pressure") || label.includes("systolic")) {
          if (v >= 160) riskScore += 40;
          else if (v >= 140) riskScore += 25;
          else if (v >= 130) riskScore += 15;
        }
      });

      if (riskScore < 25) riskLevel = "Low";
      else if (riskScore < 55) riskLevel = "Medium";
      else riskLevel = "High";

      return {
        condition,
        riskLevel,
        riskScore,
        foundKeywords,
        metrics
      };
    }

    function generateExplanation(condition, riskLevel) {
      if (condition.includes("Diabetes") || condition.toLowerCase().includes("metabolic")) {
        return (
          "Diabetes is a long-term condition where the body struggles to regulate blood sugar levels effectively. Over time, high sugar can affect blood vessels, nerves, kidneys, eyes and the heart, which is why regular monitoring and lifestyle adjustments are so important."
        );
      }
      if (condition.toLowerCase().includes("blood pressure") || condition.toLowerCase().includes("cardio-metabolic") || condition.toLowerCase().includes("cardiovascular")) {
        return (
          "High blood pressure means the force of blood pushing against your artery walls is consistently higher than normal. This can gradually strain the heart and blood vessels, increasing the risk of heart attack, stroke and kidney damage if left uncontrolled."
        );
      }
      if (condition.toLowerCase().includes("cholesterol")) {
        return (
          "Cholesterol is a fatty substance that helps build cells, but elevated levels—especially LDL—can slowly form deposits in blood vessels. These deposits may narrow arteries over time and raise the chance of heart disease or stroke."
        );
      }
      if (condition.toLowerCase().includes("kidney")) {
        return (
          "Kidney function markers like creatinine and eGFR show how well the kidneys filter waste from the blood. Changes in these values can signal reduced filtering capacity, which may require close follow-up, hydration guidance and medical evaluation."
        );
      }
      return (
        "This report does not clearly point to one specific condition in the simple rule set used here. In real life, doctors combine your symptoms, history and lab patterns to interpret results safely and accurately."
      );
    }

    function generateTreatmentTips(condition, riskLevel) {
      const base =
        "Always discuss lab findings with a qualified doctor who can interpret them in the context of your full medical history.";

      if (condition.toLowerCase().includes("diabetes") || condition.toLowerCase().includes("metabolic")) {
        return (
          base +
          " Common suggestions for blood sugar control include regular physical activity, limiting sugary and refined foods, focusing on high-fiber meals, and taking prescribed medicines exactly as directed."
        );
      }
      if (condition.toLowerCase().includes("blood pressure") || condition.toLowerCase().includes("cardio-metabolic") || condition.toLowerCase().includes("cardiovascular")) {
        return (
          base +
          " Typical lifestyle advice for high blood pressure includes reducing salt intake, managing stress, avoiding smoking, staying active most days of the week, and routinely tracking home BP readings if your doctor recommends it."
        );
      }
      if (condition.toLowerCase().includes("cholesterol")) {
        return (
          base +
          " To support healthy cholesterol levels, doctors often recommend cutting down on deep fried and processed foods, adding more fruits, vegetables and whole grains, and sometimes using cholesterol-lowering medication when needed."
        );
      }
      if (condition.toLowerCase().includes("kidney")) {
        return (
          base +
          " Kidney-friendly guidance may include staying well hydrated, avoiding unnecessary painkillers, managing blood pressure and blood sugar carefully, and following any protein and salt limits suggested by the treating team."
        );
      }

      return (
        base +
        " Even when tests look reassuring, maintaining regular check-ups, a balanced diet, movement, and sleep hygiene helps support long-term health."
      );
    }

    function generateBillEstimate(condition, riskLevel) {
      let min = 800;
      let max = 2000;

      const c = condition.toLowerCase();

      if (c.includes("diabetes") || c.includes("metabolic")) {
        min = 1500;
        max = 4500;
      }
      if (c.includes("blood pressure") || c.includes("cardio-metabolic") || c.includes("cardiovascular")) {
        min = 1800;
        max = 6000;
      }
      if (c.includes("cholesterol")) {
        min = 1300;
        max = 4000;
      }
      if (c.includes("kidney")) {
        min = 2000;
        max = 9000;
      }

      if (riskLevel === "Medium") {
        min = Math.round(min * 1.2);
        max = Math.round(max * 1.2);
      } else if (riskLevel === "High") {
        min = Math.round(min * 1.5);
        max = Math.round(max * 1.8);
      }

      return {
        min,
        max,
        text: `Estimated cost range includes lab follow-ups, basic consultations and routine medicines. Exact costs vary widely by city, hospital and insurance coverage.`
      };
    }

    function formatINR(n) {
      // Simple Indian number formatting
      return "₹" + n.toLocaleString("en-IN");
    }

    function runMockAnalysis(text) {
      const result = parseReportText(text);
      const { condition, riskLevel, riskScore, foundKeywords, metrics } = result;

      // Disease card
      diseaseNameEl.textContent = condition;
      diseaseTagEl.textContent = condition === "No obvious condition detected" ? "General" : "Detected";

      diseaseDetailsEl.textContent =
        condition === "No obvious condition detected"
          ? "The rule-based engine did not find a strong disease pattern in this text. This does not replace real clinical interpretation."
          : "This is a simulated condition derived from keywords in the report. It must be confirmed and interpreted by real clinicians in real life.";

      // Severity card
      severityLabelEl.textContent = riskLevel + " risk (demo)";
      let pillClass = "severity-low";
      if (riskLevel === "Medium") pillClass = "severity-medium";
      if (riskLevel === "High") pillClass = "severity-high";
      severityPillEl.className = "severity-pill " + pillClass;

      severityExplanationEl.textContent =
        "The risk label is computed from simple thresholds on values like glucose, cholesterol or blood pressure, plus the number of risk-related keywords.";

      mockStatus.textContent = "Completed";
      mockScore.textContent = riskScore.toString();

      // Explanation
      explanationTextEl.textContent = generateExplanation(condition, riskLevel);

      // Treatment
      treatmentTextEl.textContent = generateTreatmentTips(condition, riskLevel);

      // Bill estimation
      const bill = generateBillEstimate(condition, riskLevel);
      billRangeEl.textContent = `${formatINR(bill.min)} – ${formatINR(bill.max)}`;
      billExplanationEl.textContent = bill.text;

      // Notes
      const keywordSummary =
        foundKeywords.length > 0
          ? "Detected keyword groups: " + foundKeywords.join(", ") + ". "
          : "No strong condition-specific keyword groups were detected. ";

      const metricsSummary =
        metrics.length > 0
          ? "Sample numeric matches include: " +
            metrics
              .slice(0, 4)
              .map((m) => `${m.name.trim()} ≈ ${m.value}`)
              .join(", ") +
            "."
          : "The engine could not confidently extract numeric values in the expected patterns.";

      notesTextEl.textContent = keywordSummary + metricsSummary;

      // Summary panel
      summaryStatusEl.textContent = "Last run finished successfully.";
      summaryConditionEl.textContent = condition;
      summaryRiskEl.textContent = `${riskLevel} (${riskScore} pts)`;
      summaryBillEl.textContent = billRangeEl.textContent;

      // Hint fade-out
      resultsHintEl.style.opacity = "0.25";
    }

    function simulateAIProcessing(file, textForImageFallback) {
      setStatus("processing", "Analyzing report with mock AI engine...");
      mockStatus.textContent = "Scanning";
      mockScore.textContent = "…";

      analyzeBtn.disabled = true;
      analyzeBtn.style.opacity = "0.8";

      // Simulate duration
      const processingTime = 1600 + Math.random() * 1000;

      // Read as text for TXT, simple attempt for PDF; images fall back to provided hint string
      const ext = file.name.split(".").pop().toLowerCase();
      const isTextLike = ext === "txt";
      const isPdf = ext === "pdf";
      const isImage = ["jpg", "jpeg", "png"].includes(ext);

      const reader = new FileReader();

      reader.onload = function (e) {
        let content = "";
        if (isTextLike) {
          content = e.target.result || "";
        } else if (isPdf) {
          // PDF text extraction is non-trivial without libraries; here we simply analyze file name + a fallback text.
          content =
            (file.name || "") +
            " " +
            "glucose 160 mg/dL HbA1c 7.2 cholesterol 230 bp 140";
        } else if (isImage) {
          // No OCR; we use a generic sample string
          content = textForImageFallback;
        } else {
          content = "generic lab report glucose 150 cholesterol 210 bp 135";
        }

        setTimeout(() => {
          runMockAnalysis(content);
          setStatus("success", "Demo analysis completed. Scroll down to view insights.");
          analyzeBtn.disabled = false;
          analyzeBtn.style.opacity = "1";
        }, processingTime);
      };

      if (isTextLike) {
        reader.readAsText(file);
      } else {
        // For non-text, we do not actually need file contents, but call readAsArrayBuffer for completeness
        reader.readAsArrayBuffer(file);
      }
    }

    analyzeBtn.addEventListener("click", () => {
      if (!selectedFile) {
        setStatus("error", "Please select a report file before running analysis.");
        return;
      }

      simulateAIProcessing(
        selectedFile,
        "sample image report: glucose 180, HbA1c 7.8%, cholesterol 245, BP 150"
      );
      scrollToElement("results");
    });
  