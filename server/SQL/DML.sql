CREATE TABLE public.events
(
    id serial NOT NULL,
    title character varying(500),
    description character varying(5000),
    location character varying(100),
    "creationDate" character varying(25),
    required integer,
    members character varying(5000),
    PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
);

ALTER TABLE public.events
    OWNER to ioslpg;