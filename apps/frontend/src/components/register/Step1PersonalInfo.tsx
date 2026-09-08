import React from 'react';

interface Step1Props {
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: string;
  onChange: (
    fields: Partial<{ firstName: string; lastName: string; birthDate: string; gender: string }>,
  ) => void;
  onNext: () => void;
}

export const Step1PersonalInfo: React.FC<Step1Props> = ({
  firstName,
  lastName,
  birthDate,
  gender,
  onChange,
  onNext,
}) => {
  const isValid =
    firstName.trim().length > 0 &&
    lastName.trim().length > 0 &&
    birthDate.trim().length > 0 &&
    gender.trim().length > 0;

  return (
    <div className="space-y-4">
      <label className="block text-xs font-semibold text-[#5C5A4E]">
        First name *
        <input
          type="text"
          required
          value={firstName}
          onChange={(e) => onChange({ firstName: e.target.value })}
          placeholder="Anna"
          className="w-full h-10 mt-1.5 px-3 border border-[#D8CFB8] bg-[#FFFDF8] rounded-lg text-sm text-[#2B2E23] placeholder:text-[#A9A18A] focus:outline-none focus:border-[#C1502E]"
        />
      </label>

      <label className="block text-xs font-semibold text-[#5C5A4E]">
        Last name *
        <input
          type="text"
          required
          value={lastName}
          onChange={(e) => onChange({ lastName: e.target.value })}
          placeholder="Smith"
          className="w-full h-10 mt-1.5 px-3 border border-[#D8CFB8] bg-[#FFFDF8] rounded-lg text-sm text-[#2B2E23] placeholder:text-[#A9A18A] focus:outline-none focus:border-[#C1502E]"
        />
      </label>

      <label className="block text-xs font-semibold text-[#5C5A4E]">
        Date of birth *
        <input
          type="date"
          required
          value={birthDate}
          onChange={(e) => onChange({ birthDate: e.target.value })}
          className="w-full h-10 mt-1.5 px-3 border border-[#D8CFB8] bg-[#FFFDF8] rounded-lg text-sm text-[#2B2E23] focus:outline-none focus:border-[#C1502E]"
        />
      </label>

      <label className="block text-xs font-semibold text-[#5C5A4E]">
        Gender *
        <select
          value={gender}
          onChange={(e) => onChange({ gender: e.target.value })}
          className="w-full h-10 mt-1.5 px-3 border border-[#D8CFB8] bg-[#FFFDF8] rounded-lg text-sm text-[#2B2E23] focus:outline-none focus:border-[#C1502E]"
        >
          <option value="female">Female</option>
          <option value="male">Male</option>
        </select>
      </label>

      <button
        type="button"
        disabled={!isValid}
        onClick={onNext}
        className="w-full h-11 mt-4 bg-[#C1502E] hover:bg-[#993C1D] text-[#FFFBF2] text-sm font-medium rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Next Step: Account Info →
      </button>
    </div>
  );
};
