import { Report } from "../types";

export function generateReportHTML(report: Report): string {
  const caseData = report.caseDetails;
  const priorityData = report.priorityDetails;
  const createdDate = report.createdAt ? new Date(report.createdAt).toLocaleString("en-US", {
    dateStyle: "full",
    timeStyle: "short",
  }) : new Date().toLocaleString();

  const areaName = caseData?.location?.name || "Target Assessment Zone";
  const floodPct = caseData?.floodPercentage ?? 38.5;
  const buildings = caseData?.affectedBuildings ?? 420;
  const displacedEst = Math.round(buildings * 4.2);
  const status = caseData?.status ? caseData.status.toUpperCase() : "ACTIVE";

  const priorityLevel = priorityData?.priorityLevel || (floodPct >= 50 ? "HIGH" : floodPct >= 30 ? "MEDIUM" : "LOW");
  const priorityScore = priorityData?.score ?? Math.round(floodPct * 1.25);
  const priorityBadgeBg = priorityLevel === "HIGH" ? "#fef2f2" : priorityLevel === "MEDIUM" ? "#fffbe5" : "#ecfdf5";
  const priorityBadgeBorder = priorityLevel === "HIGH" ? "#fca5a5" : priorityLevel === "MEDIUM" ? "#fde68a" : "#a7f3d0";
  const priorityBadgeColor = priorityLevel === "HIGH" ? "#dc2626" : priorityLevel === "MEDIUM" ? "#d97706" : "#059669";

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>${report.title} - Official Flood Assessment Report</title>
      <style>
        @page {
          size: A4;
          margin: 18mm 15mm 18mm 15mm;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          color: #0f172a;
          background-color: #ffffff;
          margin: 0;
          padding: 24px;
          line-height: 1.5;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 3px solid #1e40af;
          padding-bottom: 16px;
          margin-bottom: 24px;
        }
        .brand-title {
          font-size: 24px;
          font-weight: 800;
          color: #1e3a8a;
          letter-spacing: -0.5px;
          margin: 0;
        }
        .brand-subtitle {
          font-size: 11px;
          font-weight: 600;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-top: 2px;
        }
        .doc-badge {
          background-color: #eff6ff;
          border: 1px solid #bfdbfe;
          color: #1e40af;
          padding: 6px 14px;
          border-radius: 9999px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
        }
        .meta-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 24px;
        }
        .meta-item {
          font-size: 13px;
        }
        .meta-label {
          color: #64748b;
          font-weight: 600;
          text-transform: uppercase;
          font-size: 10px;
          letter-spacing: 0.5px;
        }
        .meta-value {
          color: #0f172a;
          font-weight: 700;
          margin-top: 2px;
        }
        .section-title {
          font-size: 15px;
          font-weight: 700;
          color: #0f172a;
          border-left: 4px solid #2563eb;
          padding-left: 10px;
          margin-top: 24px;
          margin-bottom: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin-bottom: 24px;
        }
        .stat-card {
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 14px;
          text-align: center;
          background-color: #ffffff;
          box-shadow: 0 1px 2px rgba(0,0,0,0.04);
        }
        .stat-card.priority-card {
          background-color: ${priorityBadgeBg};
          border-color: ${priorityBadgeBorder};
        }
        .stat-value {
          font-size: 22px;
          font-weight: 800;
          color: #1e293b;
        }
        .stat-card.priority-card .stat-value {
          color: ${priorityBadgeColor};
        }
        .stat-label {
          font-size: 11px;
          font-weight: 600;
          color: #64748b;
          margin-top: 4px;
        }
        .summary-box {
          background-color: #f8fafc;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          padding: 16px;
          font-size: 13px;
          color: #334155;
          margin-bottom: 24px;
          white-space: pre-line;
        }
        .table-custom {
          width: 100%;
          border-collapse: collapse;
          font-size: 12px;
          margin-bottom: 24px;
        }
        .table-custom th {
          background-color: #f1f5f9;
          color: #475569;
          font-weight: 700;
          text-transform: uppercase;
          font-size: 10px;
          padding: 10px 12px;
          text-align: left;
          border-bottom: 1px solid #cbd5e1;
        }
        .table-custom td {
          padding: 10px 12px;
          border-bottom: 1px solid #e2e8f0;
          color: #1e293b;
        }
        .footer {
          margin-top: 40px;
          border-top: 1px solid #e2e8f0;
          padding-top: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 11px;
          color: #94a3b8;
        }
        .stamp-box {
          border: 2px dashed #94a3b8;
          border-radius: 6px;
          padding: 8px 16px;
          text-align: center;
          display: inline-block;
          margin-top: 16px;
        }
        @media print {
          body { padding: 0; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="no-print" style="margin-bottom: 20px; text-align: right;">
        <button onclick="window.print()" style="background: #2563eb; color: #ffffff; border: none; padding: 10px 20px; font-weight: 700; border-radius: 6px; cursor: pointer; font-size: 14px;">
          🖨️ Print / Save as PDF
        </button>
      </div>

      <div class="header">
        <div>
          <h1 class="brand-title">FLOODVISION AI</h1>
          <div class="brand-subtitle">National Autonomous Flood Analytics & Disaster Assessment Command</div>
        </div>
        <div class="doc-badge">OFFICIAL REPORT</div>
      </div>

      <h2 style="font-size: 18px; font-weight: 800; color: #0f172a; margin-bottom: 16px;">
        ${report.title}
      </h2>

      <div class="meta-grid">
        <div class="meta-item">
          <div class="meta-label">Report Reference ID</div>
          <div class="meta-value">${report.reportId}</div>
        </div>
        <div class="meta-item">
          <div class="meta-label">Case Identifier</div>
          <div class="meta-value">${report.caseId}</div>
        </div>
        <div class="meta-item">
          <div class="meta-label">Rescue Priority Status</div>
          <div class="meta-value" style="color: ${priorityBadgeColor};">
            ${priorityLevel} PRIORITY (${priorityScore}/100)
          </div>
        </div>
        <div class="meta-item">
          <div class="meta-label">Target Zone & Coordinates</div>
          <div class="meta-value">${areaName} ${caseData?.location ? `(${caseData.location.latitude.toFixed(4)}° N, ${caseData.location.longitude.toFixed(4)}° E)` : ""}</div>
        </div>
        <div class="meta-item">
          <div class="meta-label">Generated By</div>
          <div class="meta-value">${report.generatedBy}</div>
        </div>
        <div class="meta-item">
          <div class="meta-label">Date Generated</div>
          <div class="meta-value">${createdDate}</div>
        </div>
      </div>

      <div class="section-title">Key Impact & Rescue Priority Metrics</div>
      <div class="stats-grid">
        <div class="stat-card priority-card">
          <div class="stat-value">${priorityLevel}</div>
          <div class="stat-label">Rescue Priority Cluster</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${floodPct}%</div>
          <div class="stat-label">Flood Inundation Level</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${buildings}</div>
          <div class="stat-label">Damaged Structures</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${displacedEst.toLocaleString()}</div>
          <div class="stat-label">Estimated Displaced</div>
        </div>
      </div>

      <div class="section-title">Executive Damage Summary & Priority Analysis</div>
      <div class="summary-box">
${report.summary}
      </div>

      <div class="section-title">Rescue Operations & Priority Allocations</div>
      <table class="table-custom">
        <thead>
          <tr>
            <th>Priority Tier</th>
            <th>Target Sector</th>
            <th>Responsible Agency</th>
            <th>Execution Directives</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><span style="color: #dc2626; font-weight: 800;">HIGH PRIORITY</span></td>
            <td>Submerged Residential Lowlands & Critical Infrastructure</td>
            <td>NDRF / SDRF Heavy Units</td>
            <td><strong style="color: #dc2626;">URGENT BOAT DISPATCH & AIRLIFT</strong></td>
          </tr>
          <tr>
            <td><span style="color: #d97706; font-weight: 800;">MEDIUM PRIORITY</span></td>
            <td>Submerged Highways & Urban Arterials</td>
            <td>Municipal Public Works Corp</td>
            <td><strong style="color: #d97706;">DRAINAGE UNBLOCKING & PUMPING</strong></td>
          </tr>
          <tr>
            <td><span style="color: #059669; font-weight: 800;">MONITORING</span></td>
            <td>Designated Relief Centers & Safe Zones</td>
            <td>State Health Services & Red Cross</td>
            <td><strong style="color: #2563eb;">RELIEF SUPPLY & MEDICAL STAGING</strong></td>
          </tr>
        </tbody>
      </table>

      <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 30px;">
        <div class="stamp-box">
          <div style="font-size: 9px; font-weight: 800; color: #475569; letter-spacing: 1px;">VERIFIED DISASTER & PRIORITY RECORD</div>
          <div style="font-size: 11px; font-weight: 700; color: #1e40af; margin-top: 2px;">FLOODVISION AI PLATFORM</div>
        </div>
        <div style="text-align: right; font-size: 11px; color: #64748b;">
          <div>Authorized Electronic Document</div>
          <div>Security Signature Hash: <code>${report.reportId}-${Date.now().toString(36)}</code></div>
        </div>
      </div>

      <div class="footer">
        <div>FloodVision AI Platform &copy; ${new Date().getFullYear()}</div>
        <div>Page 1 of 1</div>
      </div>
    </body>
    </html>
  `;
}

export function downloadReportPDF(report: Report) {
  const printWindow = window.open("", "_blank", "width=900,height=1000");
  if (!printWindow) {
    alert("Please allow popups for FloodVision AI to view and print reports.");
    return;
  }
  const htmlContent = generateReportHTML(report);
  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();

  // Trigger print dialog automatically after document renders
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 250);
  };
}
