import React, { useState, useEffect } from "react";

const Calculator = () => {
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [memory, setMemory] = useState(0);
  const [isSecondFunction, setIsSecondFunction] = useState(false);
  const [isRadians, setIsRadians] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);

  // Confetti Animation Component
  const ConfettiExplosion = () => {
    const particles = Array.from({ length: 50 }, (_, i) => (
      <div
        key={i}
        className="absolute w-5 h-5 rounded-full animate-ping"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          backgroundColor: [
            "#ff6b6b",
            "#4ecdc4",
            "#45b7d1",
            "#96ceb4",
            "#feca57",
            "#ff9ff3",
            "#54a0ff",
          ][Math.floor(Math.random() * 7)],
          animationDelay: `${Math.random() * 0.5}s`,
          animationDuration: `${0.6 + Math.random() * 0.4}s`,
        }}
      />
    ));

    return (
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {particles}
      </div>
    );
  };

  // Check for confetti trigger (99 and 33)
  const checkConfettiTrigger = (operation, val1, val2) => {
    const num1 = parseFloat(val1);
    const num2 = parseFloat(val2);

    if ((num1 === 99 && num2 === 33) || (num1 === 33 && num2 === 99)) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    }
  };

  const inputDigit = (digit) => {
    if (waitingForOperand) {
      setDisplay(String(digit));
      setWaitingForOperand(false);
    } else {
      setDisplay(display === "0" ? String(digit) : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay("0.");
      setWaitingForOperand(false);
    } else if (display.indexOf(".") === -1) {
      setDisplay(display + ".");
    }
  };

  const clear = () => {
    setDisplay("0");
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const performOperation = (nextOperation) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      let result;

      // Check for confetti before calculation
      checkConfettiTrigger(operation, currentValue, inputValue);

      switch (operation) {
        case "+":
          result = currentValue + inputValue;
          break;
        case "−":
          result = currentValue - inputValue;
          break;
        case "×":
          result = currentValue * inputValue;
          break;
        case "÷":
          result = inputValue !== 0 ? currentValue / inputValue : 0;
          break;
        case "xʸ":
          result = Math.pow(currentValue, inputValue);
          break;
        default:
          return;
      }

      setDisplay(String(result));
      setPreviousValue(result);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = () => {
    performOperation(null);
    setOperation(null);
    setPreviousValue(null);
    setWaitingForOperand(true);
  };

  const scientificOperation = (func) => {
    const inputValue = parseFloat(display);
    let result;

    switch (func) {
      case "sin":
        result = isRadians
          ? Math.sin(inputValue)
          : Math.sin((inputValue * Math.PI) / 180);
        break;
      case "cos":
        result = isRadians
          ? Math.cos(inputValue)
          : Math.cos((inputValue * Math.PI) / 180);
        break;
      case "tan":
        result = isRadians
          ? Math.tan(inputValue)
          : Math.tan((inputValue * Math.PI) / 180);
        break;
      case "sinh":
        result = Math.sinh(inputValue);
        break;
      case "cosh":
        result = Math.cosh(inputValue);
        break;
      case "tanh":
        result = Math.tanh(inputValue);
        break;
      case "ln":
        result = inputValue > 0 ? Math.log(inputValue) : 0;
        break;
      case "log₁₀":
        result = inputValue > 0 ? Math.log10(inputValue) : 0;
        break;
      case "x²":
        result = inputValue * inputValue;
        break;
      case "x³":
        result = inputValue * inputValue * inputValue;
        break;
      case "²√x":
        result = inputValue >= 0 ? Math.sqrt(inputValue) : 0;
        break;
      case "³√x":
        result = Math.cbrt(inputValue);
        break;
      case "ʸ√x":
        result = Math.pow(inputValue, 1 / 2);
        break;
      case "eˣ":
        result = Math.exp(inputValue);
        break;
      case "10ˣ":
        result = Math.pow(10, inputValue);
        break;
      case "¹/x":
        result = inputValue !== 0 ? 1 / inputValue : 0;
        break;
      case "x!":
        if (inputValue < 0 || !Number.isInteger(inputValue)) {
          result = 0;
        } else {
          result = 1;
          for (let i = 2; i <= inputValue; i++) {
            result *= i;
          }
        }
        break;
      case "Rand":
        result = Math.random();
        break;
      case "+/-":
        result = -inputValue;
        break;
      case "%":
        result = inputValue / 100;
        break;
      default:
        return;
    }

    setDisplay(String(result));
    setWaitingForOperand(true);
  };

  const insertConstant = (constant) => {
    let value;
    switch (constant) {
      case "π":
        value = Math.PI;
        break;
      case "e":
        value = Math.E;
        break;
      default:
        return;
    }
    setDisplay(String(value));
    setWaitingForOperand(true);
  };

  const memoryOperation = (func) => {
    const inputValue = parseFloat(display);
    switch (func) {
      case "mc":
        setMemory(0);
        break;
      case "m+":
        setMemory(memory + inputValue);
        break;
      case "m-":
        setMemory(memory - inputValue);
        break;
      case "mr":
        setDisplay(String(memory));
        setWaitingForOperand(true);
        break;
    }
  };

  const Button = ({ onClick, className, children, isPressed = false }) => {
    return (
      <button
        onClick={onClick}
        className={`
          h-16 rounded-10 p-5 font-medium text-base select-none
          ${className}
          ${isPressed ? "bg-white text-orange-500" : ""}
        `}
      >
        {children}
      </button>
    );
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-800 p-4">
      <div className="bg-gray-700 rounded-2xl p-4 w-200 shadow-2xl">

        <div className="bg-[#1e1e1e] rounded-lg p-6 mb-4 text-right">
          <div className="flex items-center mb-4">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
          </div>
          <div className="text-white text-5xl font-light font-roboto">
            {display}
          </div>
        </div>

        <div className="grid grid-cols-10 gap-1 text-white">
          <Button
            onClick={() => {}}
            className="bg-[#2d2d2d] hover:bg-gray-500 text-sm"
          >
            (
          </Button>
          <Button
            onClick={() => {}}
            className="bg-[#2d2d2d] hover:bg-gray-500 text-sm"
          >
            )
          </Button>
          <Button
            onClick={() => memoryOperation("mc")}
            className="bg-[#2d2d2d] hover:bg-gray-500 text-sm"
          >
            mc
          </Button>
          <Button
            onClick={() => memoryOperation("m+")}
            className="bg-[#2d2d2d] hover:bg-gray-500 text-sm"
          >
            m+
          </Button>
          <Button
            onClick={() => memoryOperation("m-")}
            className="bg-[#2d2d2d] hover:bg-gray-500 text-sm"
          >
            m-
          </Button>
          <Button
            onClick={() => memoryOperation("mr")}
            className="bg-[#2d2d2d] hover:bg-gray-500 text-sm"
          >
            mr
          </Button>
          <Button
            onClick={clear}
            className="bg-[#2d2d2d] hover:bg-gray-500 text-sm"
          >
            C
          </Button>
          <Button
            onClick={() => scientificOperation("+/-")}
            className="bg-[#2d2d2d] hover:bg-gray-500 text-sm"
          >
            +/-
          </Button>
          <Button
            onClick={() => scientificOperation("%")}
            className="bg-[#2d2d2d] hover:bg-gray-500 text-sm"
          >
            %
          </Button>
          <Button
            onClick={() => performOperation("÷")}
            className="bg-orange-500 hover:bg-orange-400 text-white"
            isPressed={operation === "÷"}
          >
            ÷
          </Button>

          <Button
            onClick={() => setIsSecondFunction(!isSecondFunction)}
            className={`text-sm ${
              isSecondFunction
                ? "bg-white text-black"
                : "bg-[#2d2d2d] hover:bg-gray-500"
            }`}
          >
            2nd
          </Button>
          <Button
            onClick={() => scientificOperation("x²")}
            className="bg-[#2d2d2d] hover:bg-gray-500 text-sm"
          >
            x²
          </Button>
          <Button
            onClick={() => scientificOperation("x³")}
            className="bg-[#2d2d2d] hover:bg-gray-500 text-sm"
          >
            x³
          </Button>
          <Button
            onClick={() => performOperation("xʸ")}
            className="bg-[#2d2d2d] hover:bg-gray-500 text-sm"
          >
            xʸ
          </Button>
          <Button
            onClick={() => scientificOperation("eˣ")}
            className="bg-[#2d2d2d] hover:bg-gray-500 text-sm"
          >
            eˣ
          </Button>
          <Button
            onClick={() => scientificOperation("10ˣ")}
            className="bg-[#2d2d2d] hover:bg-gray-500 text-sm"
          >
            10ˣ
          </Button>
          <Button
            onClick={() => inputDigit(7)}
            className="bg-[#6e6e6e] hover:bg-gray-500"
          >
            7
          </Button>
          <Button
            onClick={() => inputDigit(8)}
            className="bg-[#6e6e6e] hover:bg-gray-500"
          >
            8
          </Button>
          <Button
            onClick={() => inputDigit(9)}
            className="bg-[#6e6e6e] hover:bg-gray-500"
          >
            9
          </Button>
          <Button
            onClick={() => performOperation("×")}
            className="bg-orange-500 hover:bg-orange-400 text-white"
            isPressed={operation === "×"}
          >
            ×
          </Button>

          <Button
            onClick={() => scientificOperation("¹/x")}
            className="bg-[#2d2d2d] hover:bg-gray-500 text-sm"
          >
            ¹⁄ₓ
          </Button>
          <Button
            onClick={() => scientificOperation("²√x")}
            className="bg-[#2d2d2d] hover:bg-gray-500 text-sm"
          >
            ²√x
          </Button>
          <Button
            onClick={() => scientificOperation("³√x")}
            className="bg-[#2d2d2d] hover:bg-gray-500 text-sm"
          >
            ³√x
          </Button>
          <Button
            onClick={() => scientificOperation("ʸ√x")}
            className="bg-[#2d2d2d] hover:bg-gray-500 text-sm"
          >
            ʸ√x
          </Button>
          <Button
            onClick={() => scientificOperation("ln")}
            className="bg-[#2d2d2d] hover:bg-gray-500 text-sm"
          >
            ln
          </Button>
          <Button
            onClick={() => scientificOperation("log₁₀")}
            className="bg-[#2d2d2d] hover:bg-gray-500 text-sm"
          >
            log₁₀
          </Button>
          <Button
            onClick={() => inputDigit(4)}
            className="bg-[#6e6e6e] hover:bg-gray-500"
          >
            4
          </Button>
          <Button
            onClick={() => inputDigit(5)}
            className="bg-[#6e6e6e] hover:bg-gray-500"
          >
            5
          </Button>
          <Button
            onClick={() => inputDigit(6)}
            className="bg-[#6e6e6e] hover:bg-gray-500"
          >
            6
          </Button>
          <Button
            onClick={() => performOperation("−")}
            className="bg-orange-500 hover:bg-orange-400 text-white"
            isPressed={operation === "−"}
          >
            −
          </Button>

          <Button
            onClick={() => scientificOperation("x!")}
            className="bg-[#2d2d2d] hover:bg-gray-500 text-sm"
          >
            x!
          </Button>
          <Button
            onClick={() => scientificOperation("sin")}
            className="bg-[#2d2d2d] hover:bg-gray-500 text-sm"
          >
            sin
          </Button>
          <Button
            onClick={() => scientificOperation("cos")}
            className="bg-[#2d2d2d] hover:bg-gray-500 text-sm"
          >
            cos
          </Button>
          <Button
            onClick={() => scientificOperation("tan")}
            className="bg-[#2d2d2d] hover:bg-gray-500 text-sm"
          >
            tan
          </Button>
          <Button
            onClick={() => insertConstant("e")}
            className="bg-[#2d2d2d] hover:bg-gray-500 text-sm"
          >
            e
          </Button>
          <Button
            onClick={() => {}}
            className="bg-[#2d2d2d] hover:bg-gray-500 text-sm"
          >
            EE
          </Button>
          <Button
            onClick={() => inputDigit(1)}
            className="bg-[#6e6e6e] hover:bg-gray-500"
          >
            1
          </Button>
          <Button
            onClick={() => inputDigit(2)}
            className="bg-[#6e6e6e] hover:bg-gray-500"
          >
            2
          </Button>
          <Button
            onClick={() => inputDigit(3)}
            className="bg-[#6e6e6e] hover:bg-gray-500"
          >
            3
          </Button>
          <Button
            onClick={() => performOperation("+")}
            className="bg-orange-500 hover:bg-orange-400 text-white"
            isPressed={operation === "+"}
          >
            +
          </Button>

          <Button
            onClick={() => setIsRadians(!isRadians)}
            className={`text-sm ${
              isRadians
                ? "bg-[#2d2d2d] text-white"
                : "bg-[#2d2d2d] hover:bg-gray-500"
            }`}
          >
            Rad
          </Button>
          <Button
            onClick={() => scientificOperation("sinh")}
            className="bg-[#2d2d2d] hover:bg-gray-500 text-sm"
          >
            sinh
          </Button>
          <Button
            onClick={() => scientificOperation("cosh")}
            className="bg-[#2d2d2d] hover:bg-gray-500 text-sm"
          >
            cosh
          </Button>
          <Button
            onClick={() => scientificOperation("tanh")}
            className="bg-[#2d2d2d] hover:bg-gray-500 text-sm"
          >
            tanh
          </Button>
          <Button
            onClick={() => insertConstant("π")}
            className="bg-[#2d2d2d] hover:bg-gray-500 text-sm"
          >
            π
          </Button>
          <Button
            onClick={() => scientificOperation("Rand")}
            className="bg-[#2d2d2d] hover:bg-gray-500 text-sm"
          >
            Rand
          </Button>
          <Button
            onClick={() => inputDigit(0)}
            className="bg-[#6e6e6e] hover:bg-gray-500 col-span-2"
          >
            0
          </Button>
          <Button
            onClick={inputDecimal}
            className="bg-[#6e6e6e] hover:bg-gray-500"
          >
            .
          </Button>
          <Button
            onClick={calculate}
            className="bg-orange-500 hover:bg-orange-400 text-white"
          >
            =
          </Button>
        </div>
      </div>
      {showConfetti && <ConfettiExplosion />}
    </div>
  );
};

export default Calculator;
