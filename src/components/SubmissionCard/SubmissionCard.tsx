import type { FormSubmission } from '../../types/form';

interface SubmissionCardProps {
  submission: FormSubmission;
  isHighlighted: boolean;
}

export default function SubmissionCard({
  submission,
  isHighlighted,
}: SubmissionCardProps) {
  return (
    <article
      className={`submission-card${isHighlighted ? ' submission-card-highlight' : ''}`}
      data-testid={`submission-${submission.id}`}
    >
      <img
        src={submission.imageBase64}
        alt={`Profile of ${submission.name}`}
        className="submission-card-image"
      />
      <div className="submission-card-content">
        <div className="submission-card-header">
          <h3>{submission.name}</h3>
          <span className="submission-card-badge">{submission.source}</span>
        </div>
        <dl className="submission-card-details">
          <div>
            <dt>Age</dt>
            <dd>{submission.age}</dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd>{submission.email}</dd>
          </div>
          <div>
            <dt>Gender</dt>
            <dd>{submission.gender}</dd>
          </div>
          <div>
            <dt>Country</dt>
            <dd>{submission.country}</dd>
          </div>
        </dl>
      </div>
    </article>
  );
}
