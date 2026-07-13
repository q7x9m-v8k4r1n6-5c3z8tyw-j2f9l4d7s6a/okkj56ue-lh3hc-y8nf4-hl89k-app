import { RaceFormWizard } from '@/core/features/create-race';

export const CreatePageRace = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">Hệ Thống Quản Lý Race MOVE</h1>
        <RaceFormWizard />
      </div>
    </div>
  );
};