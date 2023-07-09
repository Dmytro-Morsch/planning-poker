create table room
(
    id          bigint primary key generated always as identity,
    cards_shown boolean not null
);

create table player
(
    id      bigint primary key generated always as identity,
    name    varchar(100) not null,
    vote    int,
    room_id bigint       not null references room (id)
);