package dev.planningpoker.obfuscator;

import java.math.BigInteger;

public class PlayerIdObfuscator {
    private final long prime;
    private final long inversePrime;
    private final long xor;

    public PlayerIdObfuscator(long prime, long xor) {
        this.prime = prime;
        this.inversePrime = BigInteger.valueOf(prime).modInverse(BigInteger.valueOf(Long.MAX_VALUE).add(BigInteger.ONE)).longValue();
        this.xor = xor;
    }

    public long encode(long value) {
        if (value < 0) throw new IllegalArgumentException("Negative value");
        return value * prime & Long.MAX_VALUE ^ xor;
    }

    public long decode(long value) {
        if (value < 0) throw new IllegalArgumentException("Negative value");
        return (value ^ xor) * inversePrime & Long.MAX_VALUE;
    }
}
