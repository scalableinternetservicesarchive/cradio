import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Artist } from './Artist'

@Entity()
export class Song extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  duration: number

  @Column()
  genre: string

  // @OneToMany(type => SurveyAnswer, answer => answer.question, { eager: true })
  // answers: SurveyAnswer[]

  @ManyToOne(type => Artist, artist => artist.songs, {eager: true})
  artist: Artist

}
