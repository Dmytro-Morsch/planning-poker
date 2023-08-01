package dev.planningpoker.obfuscator;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class PlayerIdObfuscatorTest {

    @Test
    void test() {
        var obfuscator = new PlayerIdObfuscator(2123801081, 811468089);

        assertEquals(0, obfuscator.decode(obfuscator.encode(0)));
        assertNotEquals(0, obfuscator.encode(0));

        assertEquals(1, obfuscator.decode(obfuscator.encode(1)));
        assertNotEquals(1, obfuscator.decode(1));

        assertEquals(999, obfuscator.decode(obfuscator.encode(999)));
        assertNotEquals(999, obfuscator.encode(999));

        assertEquals(Long.MAX_VALUE, obfuscator.decode(obfuscator.encode(Long.MAX_VALUE)));
        assertNotEquals(Long.MAX_VALUE, obfuscator.encode(Long.MAX_VALUE));

        assertThrows(IllegalArgumentException.class, () -> obfuscator.encode(-1));
        assertThrows(IllegalArgumentException.class, () -> obfuscator.decode(-1));
    }
}