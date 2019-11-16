CREATE TABLE public.events
(
    id serial NOT NULL,
    title bit varying(500),
    description bit varying(5000),
    location bit varying(500),
    date bit varying(50),
    required integer,
    members bit varying(1000),
    PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
);

ALTER TABLE public.events
    OWNER to ioslpg;