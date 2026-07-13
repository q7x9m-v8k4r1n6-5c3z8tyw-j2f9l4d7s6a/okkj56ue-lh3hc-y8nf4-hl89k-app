import { useState } from 'react';
import { RaceProvider } from '../model/RaceContext';
import { Step1BasicInfo } from './Step1';
import { Step2Booths } from './Step2';
import { Step3Teams } from './Step3';
import { Step4Organizers } from './Step4';
import { Step5Settings } from './Step5';

export const RaceFormWizard = () => {
  
  const [currentStep, setCurrentStep] = useState<number>(1);

  
  const renderStep = () => {
    switch (currentStep) {
      case 1: return <Step1BasicInfo />;
      case 2: return <Step2Booths />;
      case 3: return <Step3Teams />;
      case 4: return <Step4Organizers />;
      case 5: return <Step5Settings />;
      default: return <Step1BasicInfo />;
    }
  };

  return (
    
    <RaceProvider>
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-xl rounded-2xl mt-10">
        
        
        <div className="flex justify-between border-b border-gray-200 pb-4 mb-6">
          {[1, 2, 3, 4, 5].map((stepNum) => (
            <button
              key={stepNum}
              onClick={() => setCurrentStep(stepNum)}
              className={`px-4 py-2 font-semibold transition-all ${
                currentStep === stepNum ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-400'
              }`}
            >
              Bước {stepNum}
            </button>
          ))}
        </div>

        
        <div className="min-h-[300px] mb-6">
          {renderStep()}
        </div>

       
        <div className="flex justify-between items-center border-t pt-4">
          <button
            disabled={currentStep === 1}
            onClick={() => setCurrentStep(prev => prev - 1)}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg disabled:opacity-50"
          >
            Quay lại
          </button>
          
          <span className="text-sm font-medium text-gray-500">Bước {currentStep} / 5</span>

          {currentStep < 5 ? (
            <button
              onClick={() => setCurrentStep(prev => prev + 1)}
              className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium"
            >
              Tiếp theo
            </button>
          ) : (
            <span className="text-sm text-green-600 font-semibold italic">→ Ấn nút ở trên để khởi tạo giải</span>
          )}
        </div>

      </div>
    </RaceProvider>
  );
};