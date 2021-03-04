import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';

import { Jenis } from './Jenis';
import { Kategori } from './Kategori';

@Entity({ name: 'tipe' })
export class Tipe {

  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  // tslint:disable-next-line: variable-name
  created_at: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  // tslint:disable-next-line: variable-name
  updated_at: number;

  @ManyToMany(type => Jenis)
  @JoinTable()
  // tslint:disable-next-line: variable-name
  jenis_: Jenis[];

  @ManyToMany(type => Kategori)
  @JoinTable()
  // tslint:disable-next-line: variable-name
  kategori_: Kategori[];
}
