create sequence game_id_seq cycle maxvalue 805306367; -- Max value supported by GameIdObfuscator
create sequence player_id_seq cycle maxvalue 9223372036854775807; -- Max value supported by PlayerIdObfuscator

create table game
(
    id       bigint  not null primary key,
    revealed boolean not null
);

create table player
(
    id      bigint       not null primary key,
    name    varchar(100) not null,
    vote    varchar(5),
    game_id bigint       not null references game (id),
    UNIQUE (game_id, name)
);