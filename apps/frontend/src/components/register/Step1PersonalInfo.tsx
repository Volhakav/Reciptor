import React from 'react';
import { ArrowRight, CalendarDays, Users } from 'lucide-react';
import { Input, Select } from '../ui/Field';
import { Button } from '../ui/Button';

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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="First name"
          required
          value={firstName}
          onChange={(e) => onChange({ firstName: e.target.value })}
          placeholder="Anna"
          autoComplete="given-name"
        />
        <Input
          label="Last name"
          required
          value={lastName}
          onChange={(e) => onChange({ lastName: e.target.value })}
          placeholder="Smith"
          autoComplete="family-name"
        />
      </div>

      <Input
        label="Date of birth"
        type="date"
        required
        value={birthDate}
        onChange={(e) => onChange({ birthDate: e.target.value })}
        leading={<CalendarDays className="h-4 w-4" />}
        autoComplete="bday"
      />

      <Select
        label="Gender"
        required
        value={gender}
        onChange={(e) => onChange({ gender: e.target.value })}
      >
        <option value="female">Female</option>
        <option value="male">Male</option>
      </Select>

      <Button
        type="button"
        size="lg"
        fullWidth
        disabled={!isValid}
        onClick={onNext}
        className="mt-2"
      >
        Continue
        <ArrowRight className="h-4 w-4" />
      </Button>

      <p className="flex items-center justify-center gap-1.5 text-[11px] text-muted">
        <Users className="h-3.5 w-3.5" />
        Your details stay private and are never shared.
      </p>
    </div>
  );
};
