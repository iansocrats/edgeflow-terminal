// ================================================================================
// EdgeFlow Terminal: Object-Oriented Base Detector Class
// ================================================================================
window.EdgeFlow = window.EdgeFlow || {};

/**
 * Abstract Base Class for all AI and Linguistic Detectors.
 * Subclasses must implement the analyze(text) method.
 */
class BaseDetector {
  /**
   * @param {string} id - Unique identifier (e.g. 'roberta', 'gltr', 'binoculars', 'byx', 'uniqueness')
   * @param {string} name - Human-readable detector name
   * @param {number} passThreshold - Quality threshold to achieve passing status
   * @param {string} academicReference - Scientific paper or research origin
   */
  constructor(id, name, passThreshold = 80, academicReference = '') {
    if (new.target === BaseDetector) {
      throw new TypeError("Cannot instantiate abstract BaseDetector directly.");
    }
    this.id = id;
    this.name = name;
    this.passThreshold = passThreshold;
    this.academicReference = academicReference;
  }

  /**
   * Core analysis method to be overridden by subclasses.
   * @param {string} text - The input copy to evaluate
   * @returns {Object} Diagnostic result object
   */
  analyze(text) {
    throw new Error(`Subclass ${this.constructor.name} must implement analyze(text)`);
  }

  /**
   * Calculate a normalized grade string (A+, A, B, C, F) from numeric score
   * @param {number} score - Score from 0 to 100
   * @returns {string} Letter grade
   */
  computeGrade(score) {
    if (score >= 95) return 'A+';
    if (score >= 88) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    return 'F (Risk)';
  }

  /**
   * Safe tokenization helper across detectors
   * @param {string} text
   * @returns {string[]} Lowercase word tokens
   */
  tokenize(text) {
    if (!text) return [];
    return text.toLowerCase().match(/\b[a-z0-9'$%.-]+\b/g) || [];
  }

  /**
   * Helper to format UI status indicators
   * @param {number} score
   * @returns {{ statusClass: string, label: string }}
   */
  getStatusBadge(score) {
    if (score >= this.passThreshold) {
      return { statusClass: 'green', label: 'Certified Human Alpha' };
    }
    if (score >= this.passThreshold * 0.75) {
      return { statusClass: 'gold', label: 'Controlled Caution' };
    }
    return { statusClass: 'red', label: 'AI Cliché Risk' };
  }
}

window.EdgeFlow.BaseDetector = BaseDetector;
