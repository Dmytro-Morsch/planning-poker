create sequence game_id_seq cycle maxvalue 9223372036854775807; -- Long.MAX_VALUE
create sequence player_id_seq cycle maxvalue 9223372036854775807; -- Long.MAX_VALUE

create table game
(
    id          bigint  not null primary key,
    cards_shown boolean not null
);

create table player
(
    id      bigint       not null primary key,
    name    varchar(100) not null,
    vote    varchar(5),
    game_id bigint       not null references game (id),
    UNIQUE (game_id, name)
);