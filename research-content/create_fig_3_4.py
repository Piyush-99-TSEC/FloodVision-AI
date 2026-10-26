import matplotlib.pyplot as plt
from PIL import Image
import os

img_loc = Image.open("research-content/figures/notebook_cell_125_output_0.png")
img_dmg = Image.open("research-content/figures/notebook_cell_132_output_0.png")

fig, axes = plt.subplots(1, 2, figsize=(14, 7), dpi=300)

axes[0].imshow(img_loc)
axes[0].axis('off')
axes[0].set_title("(a) Building Localization Grad-CAM Attention", fontsize=12, fontweight='bold', pad=12)

axes[1].imshow(img_dmg)
axes[1].axis('off')
axes[1].set_title("(b) Structural Damage Feature Attribution Grad-CAM", fontsize=12, fontweight='bold', pad=12)

plt.tight_layout()
out_file = "research-content/figures/figure_3_4_gradcam_explainability.png"
plt.savefig(out_file, bbox_inches='tight', dpi=300)
plt.close()
print(f"Composite Grad-CAM explainability figure saved to {out_file}")
