const 
createMemory = require('./create-memory'),
CPU = require('./cpu'),
instructions = require('./instructions');

const memory = createMemory(256);
const writeableBytes = new Uint8Array(memory.buffer);

const cpu = new CPU(memory);

writeableBytes[0] = instructions.MOV_LIT_R1;
writeableBytes[1] = 0x12; // 0x12345
writeableBytes[2] = 0x34;

writeableBytes[3] = instructions.MOV_LIT_R2;
writeableBytes[4] = 0xAB; // 0xABCD
writeableBytes[5] = 0xCD;

//Add register to register

writeableBytes[6] = instructions.ADD_REG_REG;
writeableBytes[7] = 2; //r1 index
writeableBytes[8] = 3; //r2 index

cpu.debug();

cpu.step();
cpu.debug();

cpu.step();
cpu.debug();

cpu.step();
cpu.debug();
