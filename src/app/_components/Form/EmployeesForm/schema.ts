import { z } from "zod";

enum statusProps {
    ativo = 'Ativo',
    inativo = 'Inativo',
    ferias = 'Férias',
}

export const schema = z.object({
    name: z.string().min(4, 'O nome precisa ter pelo menos 4 caracteres'),
    email: z.string().email('Este email não é válido'),
    role: z.string().min(4, 'O cargo precisa ter pelo menos 4 caracteres'),
    phone_number: z.string()
    .min(8, 'O telefone precisa ter pelo menos 8 caracteres')
    .refine((data) => !/[a-z A-Z]+/.test(data),
    {message: 'Número de telefone inválido'}
    ),
    salary: z.string().min(1, 'Digite um salario válido')
    .refine((data) => !/[a-z A-Z]+/.test(data),
    {message: 'Digite um salario válido'}
    ),
    address: z.string().min(6, 'Digite um endreço válido'),
    status: z.enum([
        statusProps.ativo,
        statusProps.inativo,
        statusProps.ferias,
    ]),
})



export type schemaProps = z.infer<typeof schema>