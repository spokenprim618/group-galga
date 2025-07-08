function drawSprite(img, x, y, size, rotation = 0) {
  push();
  translate(x + size / 2, y + size / 2);
  if (rotation) rotate(rotation);
  image(img, -size / 2, -size / 2, size, size);
  pop();
}

class UI {
  static drawTitleScreen() {
    fill(255, 255, 255);
    textAlign(CENTER);
    textSize(48);
    text("GALAGA", width / 2, 100);
    textSize(16);
    textAlign(LEFT);
    text("Your score:", 20, 20);
    text(gameState.score, 120, 20);
    textAlign(CENTER);
    text("Round " + gameState.currentRound, width / 2, 20);

    // Draw start button with visual debugging
    let buttonX = width / 2 - 50;
    let buttonY = 190;
    let buttonWidth = 100;
    let buttonHeight = 50;

    // Check if mouse is over button for hover effect
    let mouseOverButton =
      mouseX >= buttonX &&
      mouseX <= buttonX + buttonWidth &&
      mouseY >= buttonY &&
      mouseY <= buttonY + buttonHeight;

    // Draw button with hover effect
    if (mouseOverButton) {
      fill(0, 200, 0); // Darker green when hovering
    } else {
      fill(0, 255, 0); // Normal green
    }
    rect(buttonX, buttonY, buttonWidth, buttonHeight);
    fill(0);
    text("START", width / 2, 220);

    // Debug: draw mouse position and button area
    fill(255, 0, 0);
    ellipse(mouseX, mouseY, 5, 5);
    textSize(12);
    text(`Mouse: ${mouseX}, ${mouseY}`, 10, height - 20);

    // Show button area for debugging
    noFill();
    stroke(255, 255, 255);
    strokeWeight(2);
    rect(buttonX, buttonY, buttonWidth, buttonHeight);
    strokeWeight(1);

    // Show if mouse is over button
    if (mouseOverButton) {
      fill(255, 255, 255);
      text("OVER BUTTON", 10, height - 40);
    }

    // Draw all new sprites in a row for testing
    this.drawSpriteRow();
  }

  static drawSpriteRow() {
    let spriteY = 300;
    let spriteSize = 64;
    let startX = width / 2 - 5.5 * spriteSize;

    // Draw all available images in a row
    drawSprite(
      assetManager.getImage("angel"),
      startX + 0 * spriteSize,
      spriteY,
      spriteSize
    );
    drawSprite(
      assetManager.getImage("fireUp"),
      startX + 1 * spriteSize,
      spriteY,
      spriteSize
    );
    drawSprite(
      assetManager.getImage("fire2"),
      startX + 2 * spriteSize,
      spriteY,
      spriteSize
    );
    drawSprite(
      assetManager.getImage("iceUp"),
      startX + 3 * spriteSize,
      spriteY,
      spriteSize
    );
    drawSprite(
      assetManager.getImage("ice2"),
      startX + 4 * spriteSize,
      spriteY,
      spriteSize
    );
    drawSprite(
      assetManager.getImage("player1"),
      startX + 5 * spriteSize,
      spriteY,
      spriteSize
    );
    drawSprite(
      assetManager.getImage("repair"),
      startX + 6 * spriteSize,
      spriteY,
      spriteSize
    );
    drawSprite(
      assetManager.getImage("life"),
      startX + 7 * spriteSize,
      spriteY,
      spriteSize
    );
    drawSprite(
      assetManager.getImage("player"),
      startX + 8 * spriteSize,
      spriteY,
      spriteSize
    );
    drawSprite(
      assetManager.getImage("enemy"),
      startX + 9 * spriteSize,
      spriteY,
      spriteSize
    );
    drawSprite(
      assetManager.getImage("bullet"),
      startX + 10 * spriteSize,
      spriteY,
      spriteSize
    );
    drawSprite(
      assetManager.getImage("enemyBullet"),
      startX + 11 * spriteSize,
      spriteY,
      spriteSize
    );
  }

  static drawGameUI() {
    fill(255, 255, 255);
    text("Health: " + gameState.health, 950, 20);
    text("Aliens: " + gameManager.groupAlien.length, 20, 20);
    text("Round " + gameState.currentRound, width / 2 - 30, 20);
    text("Score: " + gameState.score, 20, 40);

    // Display shields in top right
    text("Shields: " + gameState.shields, 950, 40);
    if (gameState.shields > 0) {
      drawSprite(assetManager.getImage("shield"), 850, 30, 30);
    }

    // Display life pickup if held
    if (gameState.lifePickupHeld > 0) {
      text("Life Pickup: " + gameState.lifePickupHeld, 950, 60);
      drawSprite(assetManager.getImage("life"), 850, 50, 30);
    }

    this.drawPowerupStatus();
  }

  static drawPowerupStatus() {
    let yOffset = 60;

    // Display fire mode status
    if (gameState.isFireMode) {
      let remainingTime = gameState.getPowerupRemainingTime("fire");
      if (remainingTime > 0) {
        text("FIRE MODE: " + remainingTime + "s", 950, yOffset);
        fill(255, 100, 0);
        text("Press F for flamethrower", 950, yOffset + 20);
        fill(255, 255, 255);
      }
      yOffset += 40;
    }

    // Display ice mode status
    if (gameState.isIceMode) {
      let remainingTime = gameState.getPowerupRemainingTime("ice");
      if (remainingTime > 0) {
        text("ICE MODE: " + remainingTime + "s", 950, yOffset);
        fill(100, 150, 255);
        text("Press E for ice bullet", 950, yOffset + 20);
        fill(255, 255, 255);
      }
      yOffset += 40;
    }

    // Display laser mode status
    if (gameState.isLaserMode) {
      let remainingTime = gameState.getPowerupRemainingTime("laser");
      if (remainingTime > 0) {
        text("LASER MODE: " + remainingTime + "s", 950, yOffset);
        fill(255, 0, 255);
        text("Triple laser fire", 950, yOffset + 20);
        fill(255, 255, 255);
      }
      yOffset += 40;
    }

    // Display angel mode status
    if (gameState.isAngelMode) {
      let remainingTime = gameState.getPowerupRemainingTime("angel");
      if (remainingTime > 0) {
        text("ANGEL MODE: " + remainingTime + "s", 950, yOffset);
        fill(255, 255, 0);
        text("360° bullet spray", 950, yOffset + 20);
        fill(255, 255, 255);
      }
      yOffset += 40;
    }

    // Display scrap mode status
    if (gameState.isScrapMode) {
      let remainingTime = gameState.getPowerupRemainingTime("scrap");
      if (remainingTime > 0) {
        text("SCRAP MODE: " + remainingTime + "s", 950, yOffset);
        fill(150, 150, 150);
        text("Bouncing saw blades", 950, yOffset + 20);
        fill(255, 255, 255);
      }
      yOffset += 40;
    }

    // Display speed mode status
    if (gameState.isSpeedMode) {
      let remainingTime = gameState.getPowerupRemainingTime("speed");
      if (remainingTime > 0) {
        text("SPEED MODE: " + remainingTime + "s", 950, yOffset);
        fill(0, 255, 0);
        text("15% speed boost", 950, yOffset + 20);
        fill(255, 255, 255);
      }
      yOffset += 40;
    }

    // Display dark mode status
    if (gameState.isDarkMode) {
      let remainingTime = gameState.getPowerupRemainingTime("dark");
      if (remainingTime > 0) {
        text("DARK MODE: " + remainingTime + "s", 950, yOffset);
        fill(50, 50, 50);
        text("Dark mode active", 950, yOffset + 20);
        fill(255, 255, 255);
      }
      yOffset += 40;
    }
  }

  static drawBetweenRounds() {
    let remaining = gameState.getBetweenRoundsRemaining();
    fill(255, 255, 0);
    textSize(48);
    textAlign(CENTER);
    text("Next Round in " + remaining, width / 2, height / 2);
    textSize(16);
    textAlign(LEFT);
  }

  static drawGameOver() {
    fill(255, 255, 255);
    textSize(32);
    textAlign(CENTER);
    text("YOU LOSE", width / 2, height / 3);
    textSize(24);
    text("Final Score: " + gameState.score, width / 2, height / 2);
    text(
      "Rounds Completed: " + (gameState.currentRound - 1),
      width / 2,
      height / 2 + 40
    );

    // Try again button with visual feedback
    let buttonX = width / 2 - 100;
    let buttonY = height / 2 + 80;
    let buttonWidth = 200;
    let buttonHeight = 50;

    // Check if mouse is over button for hover effect
    let mouseOverButton =
      mouseX >= buttonX &&
      mouseX <= buttonX + buttonWidth &&
      mouseY >= buttonY &&
      mouseY <= buttonY + buttonHeight;

    // Draw button with hover effect
    if (mouseOverButton) {
      fill(0, 200, 0); // Darker green when hovering
    } else {
      fill(0, 255, 0); // Normal green
    }
    rect(buttonX, buttonY, buttonWidth, buttonHeight);
    fill(0);
    text("TRY AGAIN", width / 2, height / 2 + 110);

    // Debug: draw mouse position and button area
    fill(255, 0, 0);
    ellipse(mouseX, mouseY, 5, 5);
    textSize(12);
    textAlign(LEFT);
    text(`Mouse: ${mouseX}, ${mouseY}`, 10, height - 20);

    // Show button area for debugging
    noFill();
    stroke(255, 255, 255);
    strokeWeight(2);
    rect(buttonX, buttonY, buttonWidth, buttonHeight);
    strokeWeight(1);

    // Show if mouse is over button
    if (mouseOverButton) {
      fill(255, 255, 255);
      text("OVER BUTTON", 10, height - 40);
    }

    textAlign(LEFT); // Reset text alignment
    textSize(16); // Reset text size
  }

  // Utility for button click detection
  static isButtonClicked(x, y, w, h, mx = mouseX, my = mouseY) {
    return mx >= x && mx <= x + w && my >= y && my <= y + h;
  }

  static checkStartButtonClick(mx = mouseX, my = mouseY) {
    let buttonX = width / 2 - 50;
    let buttonY = 190;
    let buttonWidth = 100;
    let buttonHeight = 50;
    let isClicked = UI.isButtonClicked(
      buttonX,
      buttonY,
      buttonWidth,
      buttonHeight,
      mx,
      my
    );
    console.log(
      "Start button check:",
      isClicked,
      "Mouse position:",
      mx,
      my,
      "Button area:",
      buttonX,
      buttonY,
      buttonWidth,
      buttonHeight
    );
    return isClicked;
  }

  static checkTryAgainButtonClick(mx = mouseX, my = mouseY) {
    let buttonX = width / 2 - 100;
    let buttonY = height / 2 + 80;
    let buttonWidth = 200;
    let buttonHeight = 50;
    let isClicked = UI.isButtonClicked(
      buttonX,
      buttonY,
      buttonWidth,
      buttonHeight,
      mx,
      my
    );
    console.log(
      "Try again button check:",
      isClicked,
      "Mouse position:",
      mx,
      my,
      "Button area:",
      buttonX,
      buttonY,
      buttonWidth,
      buttonHeight
    );
    return isClicked;
  }
}
