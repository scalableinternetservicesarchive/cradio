import { BaseEntity, Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { PartyRocker } from './PartyRocker'
import { Queue } from './Queue'

@Entity()
export class ListeningSession extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  //time created is time since epoch
  @Column()
  timeCreated: number

  @Column()
  queueLength: number

  @OneToOne(type => PartyRocker, {cascade:true})
  @JoinColumn()
  owner: PartyRocker

  @OneToMany(type => PartyRocker, partyRocker => partyRocker.listeningSession, {cascade:true})
  partyRockers: PartyRocker[]

  @OneToMany(type => Queue, queue => queue.listeningSession, {cascade:true})
  queue: Queue[]
}
