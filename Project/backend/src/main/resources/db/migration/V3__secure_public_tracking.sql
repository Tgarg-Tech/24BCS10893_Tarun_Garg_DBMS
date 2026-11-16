ALTER TABLE complaints
    ADD COLUMN public_tracking_token UUID NOT NULL DEFAULT gen_random_uuid();

CREATE UNIQUE INDEX uq_complaints_public_tracking_token
    ON complaints(public_tracking_token);
