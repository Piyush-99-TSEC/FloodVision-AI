import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

def create_deck():
    prs = Presentation()
    # Set 16:9 Widescreen dimensions
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Color Palette Constants
    BG_LIGHT = RGBColor(248, 250, 252)       # Slate-50 #F8FAFC
    CARD_BG = RGBColor(255, 255, 255)        # Pure White #FFFFFF
    CARD_BORDER = RGBColor(226, 232, 240)    # Slate-200 #E2E8F0
    TEXT_NAVY = RGBColor(15, 23, 42)         # Slate-900 #0F172A
    TEXT_MUTED = RGBColor(100, 116, 139)     # Slate-500 #64748B
    TEXT_DARK = RGBColor(51, 65, 85)         # Slate-700 #334155
    ACCENT_BLUE = RGBColor(2, 132, 199)      # Sky-600 #0284C7
    ACCENT_INDIGO = RGBColor(79, 70, 229)    # Indigo-600 #4F46E5
    ACCENT_AMBER = RGBColor(217, 119, 6)     # Amber-600 #D97706
    ACCENT_EMERALD = RGBColor(5, 150, 105)   # Emerald-600 #059669
    ACCENT_RED = RGBColor(220, 38, 38)       # Red-600 #DC2626
    TAG_BG_BLUE = RGBColor(224, 242, 254)    # Sky-100 #E0F2FE

    def add_slide_header(slide, tag_text, title_text, subtitle_text):
        # Background fill
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = BG_LIGHT
        bg.line.color.rgb = BG_LIGHT

        # Top Accent Header Bar
        top_bar = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(0.1))
        top_bar.fill.solid()
        top_bar.fill.fore_color.rgb = ACCENT_BLUE
        top_bar.line.fill.background()

        # Tag Badge
        badge = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.4), Inches(2.2), Inches(0.32))
        badge.fill.solid()
        badge.fill.fore_color.rgb = TAG_BG_BLUE
        badge.line.color.rgb = RGBColor(186, 230, 253)
        tf_b = badge.text_frame
        tf_b.word_wrap = True
        p_b = tf_b.paragraphs[0]
        p_b.text = tag_text.upper()
        p_b.font.size = Pt(10)
        p_b.font.bold = True
        p_b.font.color.rgb = ACCENT_BLUE
        p_b.font.name = "Segoe UI"
        p_b.alignment = PP_ALIGN.CENTER

        # Main Title & Subtitle Box
        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.75), Inches(11.733), Inches(0.95))
        tf = title_box.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0

        p1 = tf.paragraphs[0]
        p1.text = title_text
        p1.font.size = Pt(22)
        p1.font.bold = True
        p1.font.color.rgb = TEXT_NAVY
        p1.font.name = "Segoe UI"

        p2 = tf.add_paragraph()
        p2.text = subtitle_text
        p2.font.size = Pt(12)
        p2.font.color.rgb = TEXT_MUTED
        p2.font.name = "Segoe UI"

    # =========================================================================
    # SLIDE 1: INTRODUCTION SLIDE
    # =========================================================================
    slide1 = prs.slides.add_slide(blank_layout)
    bg1 = slide1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(7.5))
    bg1.fill.solid()
    bg1.fill.fore_color.rgb = RGBColor(15, 23, 42) # Slate-900 Dark Hero Background
    bg1.line.color.rgb = RGBColor(15, 23, 42)

    # Top Cyan Line
    top_bar1 = slide1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(0.12))
    top_bar1.fill.solid()
    top_bar1.fill.fore_color.rgb = ACCENT_BLUE
    top_bar1.line.fill.background()

    # Tag Badge
    badge1 = slide1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), Inches(0.8), Inches(3.8), Inches(0.38))
    badge1.fill.solid()
    badge1.fill.fore_color.rgb = RGBColor(12, 74, 110)
    badge1.line.color.rgb = RGBColor(56, 189, 248)
    tf1_b = badge1.text_frame
    p1_b = tf1_b.paragraphs[0]
    p1_b.text = "RESEARCH-ORIENTED SKILL PROJECT (ROSP)"
    p1_b.font.size = Pt(10)
    p1_b.font.bold = True
    p1_b.font.color.rgb = RGBColor(56, 189, 248)
    p1_b.alignment = PP_ALIGN.CENTER

    # Main Project Title Box
    title_box1 = slide1.shapes.add_textbox(Inches(1.0), Inches(1.3), Inches(11.333), Inches(2.2))
    tf1 = title_box1.text_frame
    tf1.word_wrap = True

    p_t1 = tf1.paragraphs[0]
    p_t1.text = "FloodVision-AI"
    p_t1.font.size = Pt(40)
    p_t1.font.bold = True
    p_t1.font.color.rgb = RGBColor(255, 255, 255)
    p_t1.font.name = "Segoe UI"

    p_t2 = tf1.add_paragraph()
    p_t2.text = "An Explainable Deep Learning & Multimodal Earth Observation Framework for Automated Flood Damage Assessment and Intelligent Rescue Dispatch"
    p_t2.font.size = Pt(16)
    p_t2.font.color.rgb = RGBColor(148, 163, 184)
    p_t2.font.name = "Segoe UI"

    # 3 Summary Cards
    card_data = [
        ("📡 Multimodal Fusion", "Couples Sentinel-1 SAR Radar with WorldView-3/Sentinel-2 Optical satellites to eliminate cloud & nighttime blindness."),
        ("⚡ Building-Level Risk (Ri)", "Computes Ri = 0.50·Ei + 0.50·Si across 303 validated structures with explainable damage & flood exposure metrics."),
        ("🚤 Operational Rescue Dispatch", "Synthesizes tactical directives and executes priority-based responder allocation under strict capability constraints.")
    ]

    for i, (head, desc) in enumerate(card_data):
        c_left = Inches(1.0 + i * 3.85)
        card = slide1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, c_left, Inches(3.7), Inches(3.6), Inches(2.2))
        card.fill.solid()
        card.fill.fore_color.rgb = RGBColor(30, 41, 59)
        card.line.color.rgb = RGBColor(51, 65, 85)
        tf_c = card.text_frame
        tf_c.word_wrap = True
        
        p_c1 = tf_c.paragraphs[0]
        p_c1.text = head
        p_c1.font.size = Pt(14)
        p_c1.font.bold = True
        p_c1.font.color.rgb = RGBColor(56, 189, 248)
        p_c1.font.name = "Segoe UI"

        p_c2 = tf_c.add_paragraph()
        p_c2.text = desc
        p_c2.font.size = Pt(11)
        p_c2.font.color.rgb = RGBColor(203, 213, 225)
        p_c2.font.name = "Segoe UI"

    # Footer Metadata
    meta_box = slide1.shapes.add_textbox(Inches(1.0), Inches(6.3), Inches(11.333), Inches(0.6))
    tf_m = meta_box.text_frame
    p_m = tf_m.paragraphs[0]
    p_m.text = "Project Team: Group-01 | Domain: Deep Learning, Remote Sensing & Emergency Operations | Benchmark: xBD-S12 & Sen1Floods11"
    p_m.font.size = Pt(11)
    p_m.font.bold = True
    p_m.font.color.rgb = RGBColor(148, 163, 184)
    p_m.font.name = "Segoe UI"

    # =========================================================================
    # SLIDE 2: PROBLEM STATEMENT
    # =========================================================================
    slide2 = prs.slides.add_slide(blank_layout)
    add_slide_header(
        slide2,
        "Operational Bottlenecks & Gaps",
        "Problem Statement: The Breakdown in Disaster Emergency Operations",
        "Why existing remote sensing tools fail to protect lives during catastrophic flooding events"
    )

    problems = [
        ("Cloud & Nighttime Blindness (Optical Failure)",
         "Standard RGB optical satellites cannot penetrate storm clouds, monsoonal cover, or darkness during active hurricanes and floods. Responders remain blind for days until skies clear.",
         ACCENT_RED),
        ("Scattered & Disconnected Tooling",
         "Emergency Operation Centers (EOCs) must manually cross-reference isolated flood maps, disconnected GIS viewers, and radio logs, wasting critical golden hours during life-saving triage.",
         ACCENT_AMBER),
        ("The 'Heatmap-to-Action' Gap",
         "Current ML research outputs abstract pixel heatmaps or bounding boxes. They fail to generate operational mission parameters, building-level GPS pins, or tactical resource requirements.",
         ACCENT_INDIGO),
        ("Black-Box AI Skepticism & Fleet Constraints",
         "Responders distrust opaque confidence scores lacking visual justification. Furthermore, academic models assume unlimited rescue teams, ignoring real-world fleet capacity and capability limits.",
         ACCENT_BLUE)
    ]

    for i, (title, desc, color) in enumerate(problems):
        row = i // 2
        col = i % 2
        c_left = Inches(0.8 + col * 5.95)
        c_top = Inches(1.85 + row * 2.5)

        card = slide2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, c_left, c_top, Inches(5.75), Inches(2.25))
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_BG
        card.line.color.rgb = CARD_BORDER
        card.line.width = Pt(1.5)

        # Left indicator bar
        bar = slide2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, c_left, c_top, Inches(0.18), Inches(2.25))
        bar.fill.solid()
        bar.fill.fore_color.rgb = color
        bar.line.fill.background()

        tf = card.text_frame
        tf.word_wrap = True
        tf.margin_left = Inches(0.35)
        tf.margin_top = Inches(0.2)
        tf.margin_right = Inches(0.2)

        p1 = tf.paragraphs[0]
        p1.text = f"0{i+1}. {title}"
        p1.font.size = Pt(13)
        p1.font.bold = True
        p1.font.color.rgb = TEXT_NAVY
        p1.font.name = "Segoe UI"

        p2 = tf.add_paragraph()
        p2.text = desc
        p2.font.size = Pt(11)
        p2.font.color.rgb = TEXT_DARK
        p2.font.name = "Segoe UI"

    # =========================================================================
    # SLIDE 3: TABULAR LITERATURE REVIEW
    # =========================================================================
    slide3 = prs.slides.add_slide(blank_layout)
    add_slide_header(
        slide3,
        "State of the Art Comparison",
        "Tabular Literature Review: State-of-the-Art vs. FloodVision-AI",
        "Systematic comparison of disaster response paradigms across remote sensing and operational capabilities"
    )

    table_shape = slide3.shapes.add_table(6, 8, Inches(0.8), Inches(1.85), Inches(11.733), Inches(4.9))
    table = table_shape.table

    # Column Widths
    col_widths = [Inches(2.5), Inches(1.3), Inches(1.3), Inches(1.4), Inches(1.3), Inches(1.3), Inches(1.3), Inches(1.333)]
    for j, w in enumerate(col_widths):
        table.columns[j].width = w

    headers = [
        "Disaster System Paradigm",
        "All-Weather SAR Radar",
        "Flood Pixel Segmentation",
        "Building Damage Multi-Class",
        "Multimodal Risk Fusion",
        "Explainable AI (XAI)",
        "Rescue Task Generation",
        "Team Allocation Optimization"
    ]

    for j, h in enumerate(headers):
        cell = table.cell(0, j)
        cell.fill.solid()
        cell.fill.fore_color.rgb = RGBColor(15, 23, 42)
        cell.text_frame.margin_left = cell.text_frame.margin_right = Inches(0.08)
        p = cell.text_frame.paragraphs[0]
        p.text = h
        p.font.size = Pt(9.5)
        p.font.bold = True
        p.font.color.rgb = RGBColor(255, 255, 255)
        p.font.name = "Segoe UI"
        p.alignment = PP_ALIGN.CENTER if j > 0 else PP_ALIGN.LEFT

    rows_data = [
        ("Traditional Optical Systems\n(E.g. DigitalGlobe / Sentinel-2 RGB)", "✗ (Cloud Blind)", "Limited", "✗ (Manual)", "✗", "✗", "✗", "✗"),
        ("SAR Hydrological Detectors\n(E.g. Sen1Floods11 U-Net Baselines)", "✓ (C-band SAR)", "✓ (Water Only)", "✗ (No Buildings)", "✗", "✗", "✗", "✗"),
        ("Building Damage Ensembles\n(E.g. xView2 Challenge Models)", "✗ (Optical Only)", "✗ (No Water)", "✓ (4 Classes)", "✗", "Partial", "✗", "✗"),
        ("Generic Vision-Language Models\n(E.g. Multimodal Disaster VLMs)", "✗ (Optical Focus)", "✗ (Bounding Box)", "Qualitative", "✗", "Subjective", "✗", "✗"),
        ("FloodVision-AI / ROSP\n(Our Proposed Solution)", "✓ (Sentinel-1 SAR)", "✓ (Flood U-Net)", "✓ (xBD Ensembles)", "✓ (Ri = 0.5Ei+0.5Si)", "✓ (Grad-CAM + Ri)", "✓ (303 Directives)", "✓ (18 Units Optimal)")
    ]

    for i, row in enumerate(rows_data):
        is_ours = (i == len(rows_data) - 1)
        for j, val in enumerate(row):
            cell = table.cell(i + 1, j)
            cell.fill.solid()
            if is_ours:
                cell.fill.fore_color.rgb = RGBColor(240, 253, 250) if j > 0 else RGBColor(230, 248, 255)
            else:
                cell.fill.fore_color.rgb = RGBColor(255, 255, 255) if i % 2 == 0 else RGBColor(248, 250, 252)

            cell.text_frame.margin_left = cell.text_frame.margin_right = Inches(0.08)
            p = cell.text_frame.paragraphs[0]
            p.text = val
            p.font.size = Pt(9.5)
            p.font.name = "Segoe UI"

            if is_ours:
                p.font.bold = True
                p.font.color.rgb = ACCENT_BLUE if j == 0 else ACCENT_EMERALD
            else:
                p.font.color.rgb = TEXT_NAVY if j == 0 else (RGBColor(220, 38, 38) if "✗" in val else TEXT_DARK)

            p.alignment = PP_ALIGN.CENTER if j > 0 else PP_ALIGN.LEFT

    # =========================================================================
    # SLIDE 4: PROPOSED SOLUTION SHOWING FLOW DIAGRAM
    # =========================================================================
    slide4 = prs.slides.add_slide(blank_layout)
    add_slide_header(
        slide4,
        "End-to-End System Architecture",
        "Proposed Solution: Multimodal Perception & Operational Flow Diagram",
        "From raw Earth Observation satellite streams to tactical responder dispatch"
    )

    # Left Column: Step-by-Step Architecture Pipeline (Text Blocks)
    pipeline_steps = [
        ("1. Dual-Stream Satellite Ingestion",
         "Ingests Sentinel-1 C-Band SAR (VV/VH radar backscatter) alongside WorldView-3 high-resolution optical imagery for pre/post disaster scenes."),
        ("2. Deep Learning Perception Tier",
         "Flood U-Net segments standing inundation (82.4% mIoU). Optical models extract building footprints and classify structural degradation into 4 damage tiers."),
        ("3. Temporal Change & Risk Engine",
         "Calculates newly flooded extent (M_post \\ M_pre) and computes fused building risk: Ri = 0.50·Ei + 0.50·Si across all localized structures."),
        ("4. Rescue Task & Resource Allocation",
         "Maps building coordinates to WGS84 GPS, generates 303 operational missions, and dispatches 18 multi-disciplinary responder squads via capability matching."),
        ("5. Interactive GIS Response Console",
         "React/Leaflet interface renders Esri satellite basemaps, dynamic SAR flood polygons, building damage cards, and mutual-aid deficit queues.")
    ]

    for i, (title, desc) in enumerate(pipeline_steps):
        s_top = Inches(1.85 + i * 1.0)
        card = slide4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), s_top, Inches(5.8), Inches(0.92))
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_BG
        card.line.color.rgb = CARD_BORDER

        # Icon number pill
        pill = slide4.shapes.add_shape(MSO_SHAPE.OVAL, Inches(0.95), s_top + Inches(0.18), Inches(0.55), Inches(0.55))
        pill.fill.solid()
        pill.fill.fore_color.rgb = ACCENT_BLUE
        pill.line.fill.background()
        tf_p = pill.text_frame
        p_p = tf_p.paragraphs[0]
        p_p.text = str(i + 1)
        p_p.font.size = Pt(12)
        p_p.font.bold = True
        p_p.font.color.rgb = RGBColor(255, 255, 255)
        p_p.alignment = PP_ALIGN.CENTER

        tf = card.text_frame
        tf.word_wrap = True
        tf.margin_left = Inches(0.85)
        tf.margin_top = Inches(0.1)
        tf.margin_right = Inches(0.15)

        p1 = tf.paragraphs[0]
        p1.text = title
        p1.font.size = Pt(11)
        p1.font.bold = True
        p1.font.color.rgb = TEXT_NAVY
        p1.font.name = "Segoe UI"

        p2 = tf.add_paragraph()
        p2.text = desc
        p2.font.size = Pt(9.5)
        p2.font.color.rgb = TEXT_DARK
        p2.font.name = "Segoe UI"

    # Right Column: Embed Official Flow Diagram Image
    diagram_path = "research-content/figures/figure_4_methodology_data_flow.png"
    if os.path.exists(diagram_path):
        # Frame box for image
        img_frame = slide4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.85), Inches(5.733), Inches(4.9))
        img_frame.fill.solid()
        img_frame.fill.fore_color.rgb = RGBColor(255, 255, 255)
        img_frame.line.color.rgb = CARD_BORDER

        # Add image centered inside frame
        slide4.shapes.add_picture(diagram_path, Inches(6.9), Inches(1.95), Inches(5.533), Inches(4.7))
    else:
        # Fallback text box if image missing
        box = slide4.shapes.add_textbox(Inches(6.8), Inches(1.85), Inches(5.733), Inches(4.9))
        box.text_frame.text = "System Methodology Flow Diagram"

    # =========================================================================
    # SLIDE 5: OPEN SOURCE COMPONENTS & TECHNICAL APPROACH
    # =========================================================================
    slide5 = prs.slides.add_slide(blank_layout)
    add_slide_header(
        slide5,
        "Full-Stack Engineering & Algorithms",
        "Open-Source Components & Technical Implementation Approach",
        "Leveraging premier open-source geospatial tools, deep learning frameworks, and robust algorithms"
    )

    # Left Column: Open Source Tech Stack Table
    left_card = slide5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.85), Inches(5.7), Inches(4.9))
    left_card.fill.solid()
    left_card.fill.fore_color.rgb = CARD_BG
    left_card.line.color.rgb = CARD_BORDER

    tf_lc = left_card.text_frame
    tf_lc.word_wrap = True
    tf_lc.margin_left = tf_lc.margin_right = tf_lc.margin_top = Inches(0.25)
    p_lc = tf_lc.paragraphs[0]
    p_lc.text = "🛠️ Open-Source Components & Tooling"
    p_lc.font.size = Pt(13)
    p_lc.font.bold = True
    p_lc.font.color.rgb = TEXT_NAVY

    stack_items = [
        ("AI & Deep Learning", "PyTorch, Torchvision, NumPy, OpenCV, Albumentations", "Executes Flood U-Net C-band radar segmentation & xBD structural damage models."),
        ("AI Microservice Serving", "Python 3.10+, FastAPI, Uvicorn, Pydantic", "Dedicated high-performance inference engine serving REST endpoints & Swagger UI."),
        ("Backend & Geo-Processing", "Node.js, Express.js, TypeScript, GeoJSON", "Deterministic task generation, WGS84 coordinate projections, and team dispatch."),
        ("GIS Visualization & UI", "React.js, Leaflet, React-Leaflet, TailwindCSS, Recharts", "Dynamic map interface with Esri satellite basemaps and interactive layer toggles."),
        ("Open Satellite Benchmarks", "ESA Copernicus Sentinel-1 SAR & xBD Dataset", "Multi-peril disaster dataset covering hurricanes, floods, tsunamis, and earthquakes.")
    ]

    for cat, tools, desc in stack_items:
        p_cat = tf_lc.add_paragraph()
        p_cat.text = f"• {cat}: "
        p_cat.font.size = Pt(10.5)
        p_cat.font.bold = True
        p_cat.font.color.rgb = ACCENT_BLUE

        run = p_cat.add_run()
        run.text = tools
        run.font.bold = True
        run.font.color.rgb = TEXT_NAVY

        p_desc = tf_lc.add_paragraph()
        p_desc.text = f"  {desc}"
        p_desc.font.size = Pt(9.5)
        p_desc.font.color.rgb = TEXT_DARK

    # Right Column: Technical Approach Pillars
    right_card = slide5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.85), Inches(5.733), Inches(4.9))
    right_card.fill.solid()
    right_card.fill.fore_color.rgb = CARD_BG
    right_card.line.color.rgb = CARD_BORDER

    tf_rc = right_card.text_frame
    tf_rc.word_wrap = True
    tf_rc.margin_left = tf_rc.margin_right = tf_rc.margin_top = Inches(0.25)
    p_rc = tf_rc.paragraphs[0]
    p_rc.text = "⚙️ Core Technical Approaches & Formulations"
    p_rc.font.size = Pt(13)
    p_rc.font.bold = True
    p_rc.font.color.rgb = TEXT_NAVY

    approaches = [
        ("Zero-Shot SAR Domain Adaptation",
         "Pretrained Flood U-Net adapted to native 128×128 Sentinel-1 SAR tensors via standardization adapter without retraining frozen weights:\nVV_norm = (VV - (-10.38))/4.00, VH_norm = (VH - (-17.22))/4.71"),
        ("Set-Theoretic Temporal Inundation Dynamics",
         "Differentiates disaster flooding from baseline water bodies:\nNewly Flooded Extent: M_new = M_post ∧ (¬M_pre)\nPersistent Baseline Water: M_persist = M_pre ∧ M_post"),
        ("Dual-Modality Risk Equation (Ri)",
         "Fuses radar flood exposure and optical structural destruction:\nRi = 0.50·Ei + 0.50·Si  ∈ [0, 1] (Divided into Critical, High, Moderate, Low)"),
        ("Explainable Priority-Based Allocation Algorithm",
         "Greedy multi-factor scoring matching finite squads to tasks under 1:1 capacity:\nS_alloc = 0.40·S_priority + 0.35·S_capability + 0.25·S_proximity")
    ]

    for title, detail in approaches:
        p_t = tf_rc.add_paragraph()
        p_t.text = f"▸ {title}"
        p_t.font.size = Pt(10.5)
        p_t.font.bold = True
        p_t.font.color.rgb = ACCENT_INDIGO

        p_d = tf_rc.add_paragraph()
        p_d.text = detail
        p_d.font.size = Pt(9.5)
        p_d.font.color.rgb = TEXT_DARK

    # =========================================================================
    # SLIDE 6: IMPACT AND BENEFITS
    # =========================================================================
    slide6 = prs.slides.add_slide(blank_layout)
    add_slide_header(
        slide6,
        "Operational Value & Real-World Impact",
        "Impact and Benefits: Transforming Disaster Response Operations",
        "Empowering emergency commanders with rapid, auditable, and resilient decision support"
    )

    benefits = [
        ("⚡ Sub-Second Triage (<200 ms)",
         "Automates reconnaissance and evaluates 300+ building structures in under 200 ms, replacing 24–72 hours of manual helicopter and foot surveys during critical golden hours.",
         ACCENT_BLUE),
        ("🛡️ 100% All-Weather Reliability",
         "Sentinel-1 SAR C-band radar penetrates cloud cover, monsoonal storms, and night conditions, guaranteeing operational visibility when optical satellites fail.",
         ACCENT_INDIGO),
        ("🎯 Elimination of 'Heatmap-to-Action' Gap",
         "Converts raw pixel segmentations into 303 building-level tactical rescue missions specifying personnel sizes (2–8 responders) and gear (boats, USAR, drones).",
         ACCENT_EMERALD),
        ("🔍 Transparent, Auditable Decision Support",
         "Every rescue recommendation is accompanied by an explainable formula breakdown (Ri, Ei, Si), preventing algorithmic distrust among incident commanders.",
         ACCENT_AMBER),
        ("⚖️ Realistic Fleet & Deficit Management",
         "Constrained 18-squad allocation reflects genuine emergency shortages; unassigned tasks populate an explainable Deficit Backlog for incoming mutual-aid forces.",
         ACCENT_RED),
        ("🗺️ Unified Multi-Agency Geospatial Console",
         "Single web GIS platform synchronizes incident commanders, field rescue squads, and state analysts with sub-meter satellite overlays and live mission vectors.",
         RGBColor(14, 116, 144))
    ]

    for i, (title, desc, color) in enumerate(benefits):
        row = i // 3
        col = i % 3
        c_left = Inches(0.8 + col * 3.95)
        c_top = Inches(1.85 + row * 2.5)

        card = slide6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, c_left, c_top, Inches(3.8), Inches(2.3))
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_BG
        card.line.color.rgb = CARD_BORDER
        card.line.width = Pt(1.5)

        # Top accent bar on card
        top_c = slide6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, c_left, c_top, Inches(3.8), Inches(0.12))
        top_c.fill.solid()
        top_c.fill.fore_color.rgb = color
        top_c.line.fill.background()

        tf = card.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_right = Inches(0.2)
        tf.margin_top = Inches(0.22)

        p1 = tf.paragraphs[0]
        p1.text = title
        p1.font.size = Pt(12)
        p1.font.bold = True
        p1.font.color.rgb = TEXT_NAVY
        p1.font.name = "Segoe UI"

        p2 = tf.add_paragraph()
        p2.text = desc
        p2.font.size = Pt(10)
        p2.font.color.rgb = TEXT_DARK
        p2.font.name = "Segoe UI"

    # =========================================================================
    # SLIDE 7: REFERENCES
    # =========================================================================
    slide7 = prs.slides.add_slide(blank_layout)
    add_slide_header(
        slide7,
        "Academic & Technical Bibliography",
        "References: Academic Benchmarks & Foundational Literature",
        "Key peer-reviewed literature, Earth Observation datasets, and deep learning architectures utilized in FloodVision-AI"
    )

    ref_card = slide7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.85), Inches(11.733), Inches(5.0))
    ref_card.fill.solid()
    ref_card.fill.fore_color.rgb = CARD_BG
    ref_card.line.color.rgb = CARD_BORDER

    tf_r = ref_card.text_frame
    tf_r.word_wrap = True
    tf_r.margin_left = tf_r.margin_right = Inches(0.35)
    tf_r.margin_top = Inches(0.25)

    references = [
        ("[1] Bonafilia, D., Tellman, B., Anderson, T., & Issenberg, E. (2020).",
         "Sen1Floods11: A Georeferenced Dataset to Train and Test Deep Learning Flood Algorithms for Sentinel-1.",
         "IEEE/CVF Conference on Computer Vision and Pattern Recognition (CVPR) Workshops, pp. 210-211."),
        ("[2] Gupta, R., Hosfelt, R., Dooley, S., et al. (2019).",
         "xBD: A Dataset for Assessing Building Damage from Satellite Imagery.",
         "arXiv preprint arXiv:1911.09296 / IEEE/CVF CVPR Workshops (xView2 Challenge Benchmark)."),
        ("[3] Ronneberger, O., Fischer, P., & Brox, T. (2015).",
         "U-Net: Convolutional Networks for Biomedical Image Segmentation.",
         "Medical Image Computing and Computer-Assisted Intervention (MICCAI), Springer, LNCS, vol. 9351, pp. 234-241."),
        ("[4] European Space Agency (ESA). (2021).",
         "Copernicus Sentinel-1 SAR Technical Handbook & Dual-Polarization C-Band GRD Products.",
         "European Space Agency Technical Documentation, Special Publication SP-1322/1."),
        ("[5] Selvaraju, R. R., Cogswell, M., Das, A., Vedaldi, A., Parikh, D., & Batra, D. (2017).",
         "Grad-CAM: Visual Explanations from Deep Networks via Gradient-Based Localization.",
         "IEEE International Conference on Computer Vision (ICCV), pp. 618-626."),
        ("[6] Xie, E., Wang, W., Yu, Z., Anandkumar, A., Alvarez, J. M., & Luo, P. (2021).",
         "SegFormer: Simple and Efficient Design for Semantic Segmentation with Transformers.",
         "Advances in Neural Information Processing Systems (NeurIPS), vol. 34, pp. 12077-12090."),
        ("[7] United Nations Office for Disaster Risk Reduction (UNDRR) & CRED. (2020).",
         "The Human Cost of Disasters: An Overview of the Last 20 Years (2000–2019).",
         "UN Office for Disaster Risk Reduction Research Report, Geneva, Switzerland.")
    ]

    for num_auth, title, venue in references:
        p_ref = tf_r.add_paragraph() if tf_r.paragraphs[0].text else tf_r.paragraphs[0]
        p_ref.text = f"{num_auth} "
        p_ref.font.size = Pt(10.5)
        p_ref.font.bold = True
        p_ref.font.color.rgb = ACCENT_BLUE
        p_ref.font.name = "Segoe UI"

        run_title = p_ref.add_run()
        run_title.text = f'"{title}" '
        run_title.font.bold = False
        run_title.font.color.rgb = TEXT_NAVY
        run_title.font.name = "Segoe UI"

        run_venue = p_ref.add_run()
        run_venue.text = venue
        run_venue.font.italic = True
        run_venue.font.color.rgb = TEXT_MUTED
        run_venue.font.name = "Segoe UI"

    # Save presentation
    output_path = "FloodVision_AI_ROSP_Presentation.pptx"
    prs.save(output_path)
    print(f"Presentation generated successfully: {output_path}")

if __name__ == "__main__":
    create_deck()
