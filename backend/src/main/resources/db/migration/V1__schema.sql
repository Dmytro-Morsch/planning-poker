create table game
(
    id          bigint primary key generated always as identity,
    cards_shown boolean not null
);

create table player
(
    id      bigint primary key generated always as identity,
    name    varchar(100) not null,
    vote    varchar(5),
    game_id bigint       not null references game (id),
    UNIQUE (game_id, name)
);