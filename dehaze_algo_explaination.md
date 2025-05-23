
### 🔁 Algorithm Stages Explanations :


---

#### 1. **Dark Channel Computation**
- **Formula:** `min_channel = np.min(frame, axis=2)`
- **Purpose:** Identify regions in the image with heavy haze.
- The **dark channel** is obtained by taking the minimum intensity across RGB channels, followed by erosion:
  ```python
  dark_channel = cv2.erode(min_channel, np.ones((15, 15), np.uint8))
  ```
- **Variable meanings:**
  - `frame`: Original input image.
  - `min_channel`: Image of per-pixel minimum RGB values.
  - `dark_channel`: Final dark channel result after morphological erosion.

---

#### 2. **Atmospheric Light Estimation**
- Assumes that the haze is most dense in the brightest pixels of the dark channel.
- We average the color values of the top 0.1%-1% brightest pixels:
  ```python
  atmospheric_light = np.mean(frame.reshape(-1, 3)[indices], axis=0) * 0.8
  ```
- **Variable meanings:**
  - `indices`: Indices of the brightest dark channel pixels.
  - `A` (atmospheric_light): Global light intensity added by the haze.

---

#### 3. **Transmission Map Estimation**
- Estimates the portion of light that is **not** scattered and reaches the camera.
- **Formula:**
  $$
  t(x) = 1 - \omega \cdot \frac{I_{\text{dark}}(x)}{A}
  $$
- **Variable meanings:**
  - $t(x)$: Transmission map.
  - $\omega$: Tuning constant (typically 0.95) that controls haze removal strength.
  - $I_{\text{dark}}(x)$: Dark channel value at pixel $x$.
  - $A$: Atmospheric light.

---

#### 4. **Scene Radiance Recovery**
- Recovers the haze-free image from the original input and transmission map.
- **Formula:**
  $$
  J(x) = \frac{I(x) - A}{\max(t(x), t_0)} + A
  $$
- **Variable meanings:**
  - $J(x)$: Dehazed output image.
  - $I(x)$: Observed hazy input image.
  - $t_0$: Minimum transmission threshold (e.g., 0.1) to prevent division by zero.
  - $A$: Atmospheric light.

---

#### 5. **Gamma Correction**
- Enhances contrast and adjusts brightness perceptually.
- **Formula:**
  $$
  I_{\text{gamma}} = \left( \frac{I}{255} \right)^{1/\gamma} \cdot 255
  $$
- **Variable meanings:**
  - $\gamma$: Gamma value (e.g., 1.5). Higher values lighten the image.
  - $I$: Input image before correction.
  - $I_{\text{gamma}}$: Output image after gamma correction.

---

#### 6. **Color Balancing (Optional)**
- Applies white balancing to neutralize color cast using:
  ```python
  cv2.xphoto.createSimpleWB().balanceWhite(image)
  ```
- This improves the visual quality and realism of the dehazed image.

---

### ✅ Summary

| Stage                    | Main Goal                             | Key Output                 |
|--------------------------|----------------------------------------|----------------------------|
| Dark Channel             | Identify dense haze regions            | Dark channel image         |
| Atmospheric Light        | Estimate haze color/light intensity    | Atmospheric light vector A |
| Transmission Estimation  | Estimate light transmission map        | Transmission map t(x)      |
| Radiance Recovery        | Reconstruct original image             | Haze-free image J(x)       |
| Gamma Correction         | Enhance contrast                       | Gamma-adjusted image       |
| Color Balancing          | Improve color neutrality               | Balanced final image       |
