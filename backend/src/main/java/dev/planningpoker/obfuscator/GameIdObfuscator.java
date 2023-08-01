package dev.planningpoker.obfuscator;

import java.math.BigInteger;

public class GameIdObfuscator {
    private static final long[] MAX_VALUES = {
            /*                 95 */ 0b1011111L,
            /*                767 */ 0b1011111111L,
            /*               9215 */ 0b10001111111111L,
            /*              98303 */ 0b10111111111111111L,
            /*             786431 */ 0b10111111111111111111L,
            /*            9437183 */ 0b100011111111111111111111L,
            /*           83886079 */ 0b100111111111111111111111111L,
            /*          805306367 */ 0b101111111111111111111111111111L,
            /*         9663676415 */ 0b1000111111111111111111111111111111L,
            /*        85899345919 */ 0b1001111111111111111111111111111111111L,
            /*       824633720831 */ 0b1011111111111111111111111111111111111111L,
            /*      9895604649983 */ 0b10001111111111111111111111111111111111111111L,
            /*     87960930222079 */ 0b10011111111111111111111111111111111111111111111L,
            /*    844424930131967 */ 0b10111111111111111111111111111111111111111111111111L,
            /*   9570149208162303 */ 0b100001111111111111111111111111111111111111111111111111L,
            /*  90071992547409919 */ 0b100111111111111111111111111111111111111111111111111111111L,
            /* 864691128455135231 */ 0b101111111111111111111111111111111111111111111111111111111111L,
    };

    private static final long[] MASKS = {
            /*                 95 */ 0b11111L,
            /*                767 */ 0b11111111L,
            /*               9215 */ 0b001111111111L,
            /*              98303 */ 0b111111111111111L,
            /*             786431 */ 0b111111111111111111L,
            /*            9437183 */ 0b0011111111111111111111L,
            /*           83886079 */ 0b0111111111111111111111111L,
            /*          805306367 */ 0b1111111111111111111111111111L,
            /*         9663676415 */ 0b00111111111111111111111111111111L,
            /*        85899345919 */ 0b01111111111111111111111111111111111L,
            /*       824633720831 */ 0b11111111111111111111111111111111111111L,
            /*      9895604649983 */ 0b001111111111111111111111111111111111111111L,
            /*     87960930222079 */ 0b011111111111111111111111111111111111111111111L,
            /*    844424930131967 */ 0b111111111111111111111111111111111111111111111111L,
            /*   9570149208162303 */ 0b0001111111111111111111111111111111111111111111111111L,
            /*  90071992547409919 */ 0b0111111111111111111111111111111111111111111111111111111L,
            /* 864691128455135231 */ 0b1111111111111111111111111111111111111111111111111111111111L,
    };

    private final long prime;
    private final long inversePrime;
    private final long xor;
    private final long mask;
    private final long max;

    public GameIdObfuscator(long prime, long xor, int length) {
        this.mask = MASKS[length - 2];
        this.max = MAX_VALUES[length - 2];
        this.prime = prime;
        this.inversePrime = BigInteger.valueOf(prime).modInverse(BigInteger.valueOf(mask + 1L)).longValue();
        this.xor = xor & mask;
    }

    public long encode(long value) {
        if (value > max) throw new IllegalArgumentException("Value is too big");
        if (value < 0) throw new IllegalArgumentException("Negative value");
        return value * prime & mask ^ xor | value & ~mask;
    }

    public long decode(long value) {
        if (value > max) throw new IllegalArgumentException("Value is too big");
        if (value < 0) throw new IllegalArgumentException("Negative value");
        return (value ^ xor) * inversePrime & mask | value & ~mask;
    }
}
