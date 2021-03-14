import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'log' })
export class Log {

  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  url: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  // tslint:disable-next-line: variable-name
  jenis: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  // tslint:disable-next-line: variable-name
  kategori: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  // tslint:disable-next-line: variable-name
  tipe: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  // tslint:disable-next-line: variable-name
  created_at: number;
}
