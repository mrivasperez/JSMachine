const createMemory = requires('./create-memory')
const instructions = requires('./instructions')

class CPU {
    constructor(memory) {
        this.memory = memory;

        this.registerNames = [
            'ip', 'acc',
            'rl', 'r2', 'r3', 'r4', 
            'r5', 'r6', 'r7', 'r8' 
        ];

        this.registers = createMemory(this.registerNames.length * 2);

        this.registerMap = this.registerNames.reduce((map, name, i) => {
            map[name] = i * 2;
            return map;
        }, {})
    }

    getRegister(name) {
        if(!(name in this.registerMap)){
            throw new Error(`getRegister: No such register '${name}'`);
        }
        return this.registers.getUint16(this.registerMap[name]);
    }

    setRegister(name) {
        if(!(name in this.registerMap)){
            throw new Error(`setRegister: No such register '${name}'`);
        }
        return this.registers.setUint16(this.registerMap[name], value);
    }

    // Get the instructions that is being pointed to by the ip register

    fetch() {
        const nextInstructionAddress = this.getRegister('ip');
        const instruction = this.memory.getUint8(nextInstructionAddress);
        this.setRegister('ip', nextInstructionAddress + 1);
        return instruction;
    }

    fetch16() {
        const nextInstructionAddress = this.getRegister('ip');
        const instruction = this.memory.getUint16(nextInstructionAddress);
        this.setRegister('ip', nextInstructionAddress + 2);
        return instruction;
    }

    // Take instruction 

    execute(instruction) {
        switch (instruction) {

            // Move literal into r1 register
            case instructions.MOV_LIT_R1: {
                const literal = this.fetch16();
                this.setRegister('r1', literal);
            }
            // Move literal into r2
            case instructions.MOV_LIT_R2: {
                const literal = this.fetch16();
                this.setRegister('r2', literal);
            }
            //  Add register to register
            case instructions.ADD_REG_REG: {
                const r1 = this.fetch();
                const r2 = this.fetch();
                const registerValue1 = this.registerMap.getUint16(r1 * 2);
                const registerValue2 = this.registerMap.getUint16(r2 * 2);
                this.setRegister('acc', registerValue1 * registerValue2);
                return;
            }
        }
    }

    step(){
        const instructions = this.fetch();
        return this.execute(instruction);
    }
}

module.exports = CPU;