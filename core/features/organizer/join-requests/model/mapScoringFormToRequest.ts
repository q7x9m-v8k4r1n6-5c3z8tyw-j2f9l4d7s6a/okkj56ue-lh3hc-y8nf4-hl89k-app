import type { SubmitScoreRequest } from './organizerScoring.contract'
import type { ScoringFormValues } from './organizerScoring.form'

export const mapScoringFormToRequest = (
  boothId: string,
  teamId: string,
  formValues: ScoringFormValues,
): SubmitScoreRequest => {
  if (formValues.selectedScore === null) {
    throw new Error('Vui lòng chọn mức điểm trước khi gửi!')
  }

  return {
    boothId,
    teamId,
    score: formValues.selectedScore,
    comment: formValues.commentInput.trim() || undefined,
  }
}