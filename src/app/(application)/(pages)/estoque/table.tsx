'use client';

import {
    Button,
    Chip,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Input,
    Pagination,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
} from "@nextui-org/react";
import type { Selection, SortDescriptor } from "@nextui-org/react";
import { Products } from "@prisma/client";
import { ChangeEvent, Key, useCallback, useMemo, useState } from "react";
import { BiDotsVertical, BiPlus, BiSearch } from "react-icons/bi";
import { useRouter } from "next/navigation";

type props = {
    products: Products[];
};

const column = [
    {name:'ID', uid:'id'},
    {name:'NOME', uid:'name'},
    {name:'PREÇO', uid:'price'},
    {name:'QUANTIDADE', uid:'on_stock'},
    {name:'AÇÕES', uid:'actions'},
  ];


export default function ProductsTable({products}: props) {

    //Linhas da tabela
    const renderCell = useCallback((products: Products, columnKey: Key) => {
        const cellValue = products[columnKey as keyof Products];
        
        switch(columnKey) {
            case "actions":
                return(
                    <div className="relative flex items-center justify-center gap-2">
                        <Dropdown>
                        <DropdownTrigger>
                            <Button isIconOnly size="sm" variant="light">
                                <BiDotsVertical size={15} />
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu>
                            <DropdownItem>Visualizar</DropdownItem>
                            <DropdownItem>Editar</DropdownItem>
                            <DropdownItem>Deletar</DropdownItem>
                        </DropdownMenu>
                        </Dropdown>
                    </div>
                )
                default:
                 return cellValue;
        };
    },[]);

     //filtro
    const [filterValue, setFilterValue] = useState("");
    const [statusFilter, setStatusFilter] = useState<Selection>("all");

    const hasSearchFilter = Boolean(filterValue);

    const filteredItems = useMemo(() => {
        let filteredSuppliers = [...products];

        if (hasSearchFilter) {
        filteredSuppliers = filteredSuppliers.filter((user) =>
            user.name.toLowerCase().includes(filterValue.toLowerCase()),
        );
        }
        

        return filteredSuppliers;
    }, [products, filterValue, statusFilter]);

    //paginação
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(1);
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));

    const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

        return filteredItems.slice(start, end);
    }, [page, filteredItems, rowsPerPage]);

    const pages = Math.ceil(filteredItems.length / rowsPerPage);

    const onNextPage = useCallback(() => {
        if (page < pages) {
        setPage(page + 1);
        }
    }, [page, pages]);

    const onPreviousPage = useCallback(() => {
        if (page > 1) {
        setPage(page - 1);
        }
    }, [page]);

    const onRowsPerPageChange = useCallback(
        (e: ChangeEvent<HTMLSelectElement>) => {
        setRowsPerPage(Number(e.target.value));
        setPage(1);
        },
        [],
    );

    const onSearchChange = useCallback((value?: string) => {
        if (value) {
        setFilterValue(value);
        setPage(1);
        } else {
        setFilterValue("");
        }
    }, []);

    const onClear = useCallback(() => {
        setFilterValue("");
        setPage(1);
    }, []);

    const bottomContent = useMemo(() => {
        return (
        <div className="flex items-center justify-between px-2 py-2">
            <span className="w-[30%] text-small text-default-400">
            {selectedKeys === "all"
                ? "Todos os itens selecionados"
                : `${selectedKeys.size} de ${filteredItems.length} selecionados`}
            </span>
            <Pagination
            isCompact
            showControls
            showShadow
            color="primary"
            page={page}
            total={pages}
            onChange={setPage}
            />
            <div className="hidden w-[30%] justify-end gap-2 sm:flex">
            <Button
                isDisabled={pages === 1}
                size="sm"
                variant="flat"
                onPress={onPreviousPage}
            >
                Anterior
            </Button>
            <Button
                isDisabled={pages === 1}
                size="sm"
                variant="flat"
                onPress={onNextPage}
            >
                Próximo
            </Button>
            </div>
        </div>
        );
    }, [items.length, page, pages, selectedKeys]);

    //sorted
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
        column: "name",
        direction: "ascending",
    });
    const sortedItems = useMemo(() => {
        return [...items].sort((a: Products, b: Products) => {
        const first = a[sortDescriptor.column as keyof Products] as number;
        const second = b[sortDescriptor.column as keyof Products] as number;
        const cmp = first < second ? -1 : first > second ? 1 : 0;

        return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [sortDescriptor, items]);

    //parte de cima da tabela

    const router = useRouter();

    const topContent = useMemo(() => {
        return (
        <div className="flex flex-col gap-4">
            <div className="flex items-end justify-between gap-3">
            <Input
                isClearable
                className="w-full sm:max-w-[44%]"
                placeholder="Procure pelo nome..."
                startContent={<BiSearch />}
                value={filterValue}
                onClear={() => onClear()}
                onValueChange={onSearchChange}
            />
            <div className="flex gap-3">
                <Button color="primary" onClick={() => router.push("/estoque/?modal=true")} endContent={<BiPlus size={12} />}>
                Novo
                </Button>
            </div>
            </div>
            <div className="flex items-center justify-between">
            <span className="text-small text-default-400">
                Total {products.length} users
            </span>
            <label className="flex items-center text-small text-default-400">
                Linhas por página:
                <select
                className="bg-transparent text-small text-default-400 outline-none"
                onChange={onRowsPerPageChange}
                >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
                </select>
            </label>
            </div>
        </div>
        );
    }, [
        filterValue,
        statusFilter,
        onSearchChange,
        onRowsPerPageChange,
        products.length,
        hasSearchFilter,
    ]);

    return(
        <div className="w-4/5">
            <Table
                aria-label="Tabela de produtos"
                isHeaderSticky
                bottomContent={bottomContent}
                bottomContentPlacement="outside"
                selectionMode="multiple"
                selectedKeys={selectedKeys}
                onSelectionChange={setSelectedKeys}
                topContent={topContent}
                topContentPlacement="outside"
                sortDescriptor={sortDescriptor}
                onSortChange={setSortDescriptor}
                classNames={{
                  wrapper: "max-h-[382px]",
                }}
            >
                <TableHeader columns={column}>
                    {(column) => (
                        <TableColumn key={column.uid}>
                            {column.name}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody emptyContent='não foi cadastrado nenhum produto' items={sortedItems}>
                    {(items) => (
                        <TableRow key={items.id}>
                            {(columnKey) => (
                                <TableCell>{renderCell(items, columnKey)}</TableCell>
                            )}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}