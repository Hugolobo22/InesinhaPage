let highestZ = 1;

class Paper {
  holdingPaper = false;
  touchX = 0;
  touchY = 0;
  mouseX = 0;
  mouseY = 0;
  prevMouseX = 0;
  prevMouseY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  init(paper) {
    const moveHandler = (x, y) => {
      if (!this.rotating) {
        this.mouseX = x;
        this.mouseY = y;
        this.velX = this.mouseX - this.prevMouseX;
        this.velY = this.mouseY - this.prevMouseY;
      }

      const dirX = x - this.touchX;
      const dirY = y - this.touchY;
      const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
      const dirNormalizedX = dirX / dirLength;
      const dirNormalizedY = dirY / dirLength;
      const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
      let degrees = (360 + Math.round((180 * angle) / Math.PI)) % 360;

      if (this.rotating) {
        this.rotation = degrees;
      }

      if (this.holdingPaper) {
        if (!this.rotating) {
          this.currentPaperX += this.velX;
          this.currentPaperY += this.velY;
        }
        this.prevMouseX = this.mouseX;
        this.prevMouseY = this.mouseY;

        paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
      }
    };

    // Suporte para mouse
    document.addEventListener("mousemove", (e) => {
      moveHandler(e.clientX, e.clientY);
    });

    // Suporte para toque
    document.addEventListener("touchmove", (e) => {
      moveHandler(e.touches[0].clientX, e.touches[0].clientY);
    });

    const startHandler = (x, y, button = 0) => {
      if (this.holdingPaper) return;
      this.holdingPaper = true;
      paper.style.zIndex = highestZ;
      highestZ += 1;

      if (button === 0) {
        this.touchX = x;
        this.touchY = y;
        this.prevMouseX = x;
        this.prevMouseY = y;
      }

      if (button === 2) {
        this.rotating = true;
      }
    };

    // Início do movimento (mouse e toque)
    paper.addEventListener("mousedown", (e) => {
      startHandler(e.clientX, e.clientY, e.button);
    });
    paper.addEventListener("touchstart", (e) => {
      startHandler(e.touches[0].clientX, e.touches[0].clientY);
    });

    // Encerrar movimento (mouse e toque)
    const endHandler = () => {
      this.holdingPaper = false;
      this.rotating = false;
    };
    window.addEventListener("mouseup", endHandler);
    window.addEventListener("touchend", endHandler);
  }
}

const papers = Array.from(document.querySelectorAll(".paper"));
papers.forEach((paper) => {
  const p = new Paper();
  p.init(paper);
});
